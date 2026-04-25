const express = require('express');
const router = express.Router();
const { 
  createShipment, getShipments, getShipmentById, 
  trackShipment, assignTransporter, updateStatus 
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin', 'supplier', 'transporter'), getShipments)
  .post(protect, authorize('supplier'), createShipment);

const Shipment = require('../models/Shipment');

router.get('/track/:trackingId', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.trackingId })
      .populate('createdBy', 'name')
      .populate('assignedTransporter', 'name')
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' })
    res.json(shipment)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.route('/:id')
  .get(protect, getShipmentById);

router.patch('/:id/assign', protect, authorize('admin'), assignTransporter);
router.patch('/:id/status', protect, authorize('admin', 'transporter'), updateStatus);

module.exports = router;