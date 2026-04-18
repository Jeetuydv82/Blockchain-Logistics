// server/models/SensorData.js
const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    alertTriggered: {
      type: Boolean,
      default: false
    },
    alertReason: {
      type: String,
      enum: ['temperature_high', 'temperature_low', 'humidity_high', 'humidity_low', null],
      default: null
    }
  },
  {
    timestamps: true
  }
);

SensorDataSchema.index({ shipment: 1, timestamp: -1 });

module.exports = mongoose.model('SensorData', SensorDataSchema);