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
    ],

    // IoT Sensor Tracking
    requiresTemperatureTracking: { type: Boolean, default: false },
    tempThreshold: { type: Number, default: 30 },
    sensorAlerts: [
      {
        reason: String,
        temperature: Number,
        humidity: Number,
        timestamp: Date,
        resolved: { type: Boolean, default: false }
      }
    ],

    // Payment
    paymentStatus: {
      type: String,
      enum: ['none', 'pending', 'locked', 'released', 'refunded'],
      default: 'none'
    },
    paymentAmount: { type: Number, default: 0 },
    paymentTxHash: { type: String, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Shipment', ShipmentSchema);