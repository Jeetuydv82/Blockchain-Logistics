// server/controllers/shipmentController.js
const Shipment = require('../models/Shipment');

// ─── CREATE SHIPMENT ───────────────────────────────────
// POST /api/shipments
const createShipment = async (req, res) => {
  try {
    const {
      title,
      description,
      origin,
      destination
    } = req.body;

    const shipment = await Shipment.create({
      title,
      description,
      origin,
      destination,
      createdBy    : req.user.id,
      statusHistory: [{
        status    : 'pending',
        note      : 'Shipment created',
        updatedBy : req.user.id
      }]
    });

    res.status(201).json({
      success  : true,
      message  : 'Shipment created successfully',
      shipment
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET ALL SHIPMENTS ─────────────────────────────────
// GET /api/shipments
const getAllShipments = async (req, res) => {
  try {
    let query = {};

    // If customer → only show their shipments
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
// GET /api/shipments/:id
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

    res.json({
      success : true,
      shipment
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── UPDATE SHIPMENT STATUS ────────────────────────────
// PUT /api/shipments/:id/status
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

    // Update status
    shipment.status = status;

    // Add to history
    shipment.statusHistory.push({
      status,
      note      : note || `Status updated to ${status}`,
      updatedBy : req.user.id,
      timestamp : new Date()
    });

    await shipment.save();

    res.json({
      success  : true,
      message  : 'Shipment status updated',
      shipment
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── DELETE SHIPMENT ───────────────────────────────────
// DELETE /api/shipments/:id
const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success : false,
        message : 'Shipment not found'
      });
    }

    // Only admin or creator can delete
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

module.exports = {
  createShipment,
  getAllShipments,
  getShipment,
  updateStatus,
  deleteShipment
};