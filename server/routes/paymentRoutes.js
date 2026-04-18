// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { lockPayment, releasePayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/lock', lockPayment);
router.post('/release', releasePayment);
router.get('/:shipmentId', getPaymentStatus);

module.exports = router;