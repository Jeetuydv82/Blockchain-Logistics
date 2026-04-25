const express = require('express');
const router = express.Router();
const { getUsers, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/stats', getStats);

module.exports = router;
