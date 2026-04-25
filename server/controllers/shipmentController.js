const Shipment = require('../models/Shipment');
const User = require('../models/User');
const ethers = require('ethers');
const ShipmentTrackingABI = require('../config/blockchain/ShipmentTracking.json');

// Generate Unique Tracking ID
const generateTrackingId = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SHP-${timestamp}-${random}`
}

exports.createShipment = async (req, res) => {
  try {
    const trackingId = generateTrackingId();
    const shipment = new Shipment({
      ...req.body,
      trackingId,
      createdBy: req.user.id,
      status: 'pending',
      statusHistory: [{ status: 'pending', updatedBy: req.user.id }]
    });
    const savedShipment = await shipment.save();
    res.status(201).json(savedShipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShipments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'supplier') {
      query = { createdBy: req.user.id };
    } else if (req.user.role === 'transporter') {
      query = { assignedTransporter: req.user.id };
    }
    // admin → no filter (sees all)
    // customer → uses track endpoint, not this one
    
    const shipments = await Shipment.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTransporter', 'name email')
      .sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTransporter', 'name email phone')
      .populate('documents');
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.trackingId })
      .populate('statusHistory.updatedBy', 'name role')
      .populate('assignedTransporter', 'name phone')
      .populate('documents', 'originalName fileHash blockchainTxHash');
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignTransporter = async (req, res) => {
  try {
    const { transporterId } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    
    shipment.assignedTransporter = transporterId;
    shipment.status = 'assigned';
    shipment.statusHistory.push({
      status: 'assigned',
      updatedBy: req.user.id,
      timestamp: new Date()
    });
    await shipment.save();
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransporter = async (req, res) => {
  try {
    const { name, phone, vehicleNumber, assignedDate } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    
    if (shipment.assignedTransporter) {
      const transporter = await User.findById(shipment.assignedTransporter);
      if (transporter) {
        if (name) transporter.name = name;
        if (phone) transporter.phone = phone;
        await transporter.save();
      }
    }
    
    if (vehicleNumber !== undefined) {
      shipment.vehicleNumber = vehicleNumber;
    }

    if (assignedDate) {
      // Find the 'assigned' entry in statusHistory and update its timestamp
      const assignedEntry = shipment.statusHistory.find(h => h.status === 'assigned');
      if (assignedEntry) {
        assignedEntry.timestamp = new Date(assignedDate);
      }
    }
    
    await shipment.save();
    res.json(shipment);
  } catch (error) {
    console.error('Update Transporter Error Detail:', {
      message: error.message,
      stack: error.stack,
      errors: error.errors // Mongoose validation errors
    });
    res.status(500).json({ 
      message: error.message || 'Failed to update transporter',
      details: error.errors 
    });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    
    // Only admin or the creator can update general details
    if (req.user.role !== 'admin' && shipment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this shipment' });
    }

    const allowedUpdates = [
      'title', 'description', 'origin', 'destination', 
      'weight', 'value', 'receiverName', 'receiverPhone', 'receiverAddress'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        shipment[field] = req.body[field];
      }
    });

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, location, note } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    
    if (req.user.role !== 'admin' && req.user.role !== 'transporter') {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }
    
    if (req.user.role === 'transporter' && shipment.assignedTransporter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this shipment' });
    }

    shipment.status = status;
    shipment.statusHistory.push({
      status,
      updatedBy: req.user.id,
      location: location || '',
      note: note || '',
      timestamp: new Date()
    });
    
    await shipment.save();
    
    let blockchainTxHash = null;
    try {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        process.env.SHIPMENT_CONTRACT_ADDRESS,
        ShipmentTrackingABI.abi,
        wallet
      );
      const tx = await contract.updateShipmentStatus(
        shipment.blockchainShipmentId || 0,
        status
      );
      const receipt = await tx.wait();
      blockchainTxHash = receipt.hash;
      
      shipment.statusHistory[shipment.statusHistory.length - 1].blockchainTxHash = blockchainTxHash;
      await shipment.save();
    } catch (blockchainError) {
      console.warn('Blockchain write failed (Hardhat may not be running):', blockchainError.message);
    }

    res.json({
      success: true,
      shipment,
      blockchainTxHash,
      blockchainRecorded: !!blockchainTxHash
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};