const Shipment = require('../models/Shipment');

// Generate Unique Tracking ID
const generateTrackingId = () => {
  return 'SHP-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

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
      .populate('assignedTransporter', 'name email')
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

exports.updateStatus = async (req, res) => {
  try {
    const { status, location, blockchainTxHash } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    
    // Ensure transporter is assigned to this shipment
    if (req.user.role === 'transporter' && shipment.assignedTransporter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this shipment' });
    }

    shipment.status = status;
    shipment.statusHistory.push({
      status,
      updatedBy: req.user.id,
      location,
      blockchainTxHash,
      timestamp: new Date()
    });
    
    await shipment.save();
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};