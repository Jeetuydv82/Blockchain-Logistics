const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'] },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  blockchainTxHash: String,
  location: String,
  note: String
});

const shipmentSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: String,
  origin: String,
  destination: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTransporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'],
    default: 'pending'
  },
  statusHistory: [statusHistorySchema],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  estimatedDelivery: Date,
  weight: Number,
  value: Number,
  receiverName: String,
  receiverPhone: String,
  receiverAddress: String,
  vehicleNumber: String,
  blockchainShipmentId: Number
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);