const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
  originalName: String,
  fileSize: Number,
  fileHash: { type: String, required: true },
  blockchainTxHash: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);