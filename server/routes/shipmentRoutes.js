// server/routes/shipmentRoutes.js
const express  = require('express');
const router   = express.Router();
const {
  createShipment,
  getAllShipments,
  getShipment,
  updateStatus,
  deleteShipment
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
.get(getAllShipments)
.post(createShipment);

router.route('/:id')
  .get(getShipment)
  .delete(deleteShipment);

router.put('/:id/status', updateStatus);

module.exports = router;