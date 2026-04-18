// server/routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const {
  receiveSensorData,
  getSensorHistory,
  enableTemperatureTracking
} = require('../controllers/sensorController');

router.post('/data', receiveSensorData);
router.get('/:shipmentId', getSensorHistory);
router.put('/:shipmentId/enable', enableTemperatureTracking);

module.exports = router;