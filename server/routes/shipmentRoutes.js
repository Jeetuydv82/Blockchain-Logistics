const express = require('express');
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getShipment,
  updateStatus,
  deleteShipment,
  getShipmentByTracking,
  predictDeliveryTime
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/auth');

// Public route - MUST come before protect middleware
router.get('/public/:trackingNumber', getShipmentByTracking);

// All other routes are protected
router.use(protect);

router.route('/')
  .get(getAllShipments)
  .post(createShipment);

router.route('/:id')
  .get(getShipment)
  .delete(deleteShipment);

router.put('/:id/status', updateStatus);
router.get('/:id/predict-delivery', predictDeliveryTime);

module.exports = router;