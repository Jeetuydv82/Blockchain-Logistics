// server/controllers/shipmentController.js
const Shipment         = require('../models/Shipment');
const User            = require('../models/User');
const { shipmentContract } = require('../config/blockchain');
const { predictDelivery } = require('../utils/predictionService');
const { sendShipmentCreated, sendStatusUpdate } = require('../utils/emailService');
const { sendDeliveryNotification } = require('../utils/smsService');

// ─── CREATE SHIPMENT ───────────────────────────────────
const createShipment = async (req, res) => {
  try {
    const { title, description, origin, destination } = req.body;

    // 1. Save to MongoDB first
    const shipment = await Shipment.create({
      title,
      description,
      origin,
      destination,
      createdBy     : req.user.id,
      statusHistory : [{
        status    : 'pending',
        note      : 'Shipment created',
        updatedBy : req.user.id
      }]
    });

    // 2. Record on blockchain
    try {
      const tx = await shipmentContract.createShipment(
        shipment.trackingNumber,
        "pending"
      );
    
      await tx.wait();
    
      shipment.blockchainTxHash = tx.hash;
      shipment.blockchainStatus = "recorded";
    
      await shipment.save();
    
      console.log('✅ Blockchain tx:', tx.hash);
    
    } catch (blockchainError) {
      console.error('⚠️ Blockchain error:', blockchainError.message);
      // Don't fail — just log. MongoDB record still saved.
    }

    res.status(201).json({
      success  : true,
      message  : 'Shipment created successfully',
      shipment
    });

    // Send email notification
    try {
      const user = await User.findById(req.user.id).select('email name emailNotifications');
      if (user?.emailNotifications && user.email) {
        sendShipmentCreated({ email: user.email, name: user.name }, shipment);
      }
    } catch (emailError) {
      console.log('Email notification error:', emailError.message);
    }

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── UPDATE STATUS ─────────────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success : false,
        message : 'Shipment not found'
      });
    }

    // 1. Update MongoDB
    shipment.status = status;
    shipment.statusHistory.push({
      status,
      note      : note || `Status updated to ${status}`,
      updatedBy : req.user.id,
      timestamp : new Date()
    })
    // 2. Update on blockchain
    try {
      const tx = await shipmentContract.updateStatus(
        shipment.trackingNumber,
        status,
        note || `Status updated to ${status}`
      );
      const receipt = await tx.wait();

      shipment.blockchainTxHash = receipt.hash;
      console.log('✅ Status updated on blockchain:', receipt.hash);

    } catch (blockchainError) {
      console.error('⚠️ Blockchain error:', blockchainError.message);
    }

    await shipment.save();

    res.json({
      success  : true,
      message  : 'Shipment status updated',
      shipment
    });

    // Send notifications
    try {
      const user = await User.findById(shipment.createdBy).select('email name phone emailNotifications smsNotifications');
      
      if (user?.emailNotifications && user.email) {
        // Send email
        sendStatusUpdate({ email: user.email, name: user.name }, shipment, status, note);
      }

      if (user?.smsNotifications && user.phone && (status === 'out_for_delivery' || status === 'delivered')) {
        // Send SMS
        sendDeliveryNotification(user.phone, shipment.trackingNumber, status);
      }
    } catch (notificationError) {
      console.log('Notification error:', notificationError.message);
    }

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET ALL SHIPMENTS ─────────────────────────────────
const getAllShipments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.createdBy = req.user.id;
    }

    const shipments = await Shipment.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success : true,
      count   : shipments.length,
      shipments
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET SINGLE SHIPMENT ───────────────────────────────
const getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('createdBy', 'name email role');

    if (!shipment) {
      return res.status(404).json({
        success : false,
        message : 'Shipment not found'
      });
    }

    res.json({ success: true, shipment });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── DELETE SHIPMENT ───────────────────────────────────
const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success : false,
        message : 'Shipment not found'
      });
    }

    if (shipment.createdBy.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success : false,
        message : 'Not authorized to delete this shipment'
      });
    }

    await shipment.deleteOne();

    res.json({
      success : true,
      message : 'Shipment deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET SHIPMENT BY TRACKING NUMBER (PUBLIC) ─────────────────────
const getShipmentByTracking = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber
    }).select('-blockchainTxHash -blockchainStatus -createdBy');

    if (!shipment) {
      return res.status(404).json({
        success : false,
        message : 'Shipment not found'
      });
    }

    res.json({ success: true, shipment });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── PREDICT DELIVERY ───────────────────────────────────────────────
const predictDeliveryTime = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success : false,
        message : 'Shipment not found'
      });
    }

    const prediction = await predictDelivery(shipment._id);

    res.json({
      success : true,
      prediction
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

module.exports = {
  createShipment,
  getAllShipments,
  getShipment,
  updateStatus,
  deleteShipment,
  getShipmentByTracking,
  predictDeliveryTime
};