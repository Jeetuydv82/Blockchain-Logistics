// server/models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    filename: {
      type     : String,
      required : true
    },

    originalName: {
      type     : String,
      required : true
    },

    fileType: {
      type     : String,
      required : true
    },

    fileSize: {
      type     : Number,
      required : true
    },

    // SHA256 hash of file content
    fileHash: {
      type     : String,
      required : true,
      unique   : true
    },

    // Which shipment this doc belongs to
    shipment: {
      type : mongoose.Schema.Types.ObjectId,
      ref  : 'Shipment'
    },

    // Who uploaded
    uploadedBy: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : 'User',
      required : true
    },

    // Blockchain data (filled on Day 13)
    blockchainTxHash : { type: String, default: null },
    isVerified       : { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', DocumentSchema);