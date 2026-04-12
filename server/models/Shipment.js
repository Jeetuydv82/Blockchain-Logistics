// server/models/Shipment.js
const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type    : String,
      unique  : true,
      default : () => 'SHP-' + Date.now()
    },

    title: {
      type     : String,
      required : [true, 'Shipment title is required'],
      trim     : true
    },

    description: {
      type : String,
      trim : true
    },

    // Who created this shipment
    createdBy: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : 'User',
      required : true
    },

    origin: {
      address : { type: String, required: true },
      city    : { type: String, required: true },
      country : { type: String, required: true }
    },

    destination: {
      address : { type: String, required: true },
      city    : { type: String, required: true },
      country : { type: String, required: true }
    },

    status: {
      type    : String,
      enum    : [
        'pending',
        'picked_up',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'cancelled'
      ],
      default : 'pending'
    },

    // Blockchain data (we fill this on Day 11)
    blockchainTxHash : { type: String, default: null },
    blockchainStatus : { type: String, default: 'not_recorded' },

    // Status history (every update logged)
    statusHistory: [
      {
        status    : String,
        note      : String,
        updatedBy : {
          type : mongoose.Schema.Types.ObjectId,
          ref  : 'User'
        },
        timestamp : { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Shipment', ShipmentSchema);