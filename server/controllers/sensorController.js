// server/controllers/sensorController.js
const SensorData = require('../models/SensorData');
const Shipment = require('../models/Shipment');

const receiveSensorData = async (req, res) => {
  try {
    const { shipmentId, temperature, humidity, location, timestamp } = req.body;

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    let alertTriggered = false;
    let alertReason = null;

    if (shipment.requiresTemperatureTracking) {
      if (temperature > shipment.tempThreshold) {
        alertTriggered = true;
        alertReason = 'temperature_high';
      } else if (temperature < (shipment.tempThreshold - 10)) {
        alertTriggered = true;
        alertReason = 'temperature_low';
      }
    }

    const sensorData = await SensorData.create({
      shipment: shipmentId,
      temperature,
      humidity,
      location,
      timestamp: timestamp || new Date(),
      alertTriggered,
      alertReason
    });

    await Shipment.findByIdAndUpdate(shipmentId, {
      $push: {
        sensorAlerts: {
          reason: alertReason,
          temperature,
          humidity,
          timestamp: new Date(),
          resolved: false
        }
      }
    });

    res.status(201).json({
      success: true,
      sensorData,
      alertTriggered
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSensorHistory = async (req, res) => {
  try {
    const sensorData = await SensorData.find({ shipment: req.params.shipmentId })
      .sort({ timestamp: -1 })
      .limit(100);

    const stats = await SensorData.aggregate([
      { $match: { shipment: req.params.shipmentId } },
      {
        $group: {
          _id: null,
          avgTemp: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          minTemp: { $min: '$temperature' },
          maxTemp: { $max: '$temperature' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      sensorData,
      stats: stats[0] || null
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const enableTemperatureTracking = async (req, res) => {
  try {
    const { threshold = 30 } = req.body;

    const shipment = await Shipment.findByIdAndUpdate(
      req.params.shipmentId,
      {
        requiresTemperatureTracking: true,
        tempThreshold: threshold
      },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      shipment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  receiveSensorData,
  getSensorHistory,
  enableTemperatureTracking
};