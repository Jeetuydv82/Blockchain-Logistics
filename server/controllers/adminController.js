const User = require('../models/User');
const Shipment = require('../models/Shipment');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalOrders = await Shipment.countDocuments();
    const delivered = await Shipment.countDocuments({ status: 'delivered' });
    const pending = await Shipment.countDocuments({ status: 'pending' });
    
    // Mock revenue based on value
    const shipmentsWithValue = await Shipment.find({ value: { $exists: true } });
    const revenue = shipmentsWithValue.reduce((acc, shp) => acc + (shp.value || 0), 0) * 0.1; // 10% fee

    res.json({
      totalOrders,
      delivered,
      pending,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
