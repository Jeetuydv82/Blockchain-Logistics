require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');
const User = require('../models/User');

async function debug() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const shipment = await Shipment.findOne({ trackingId: /KXFDJU/ });
  console.log('Shipment:', JSON.stringify(shipment, null, 2));
  if (shipment.assignedTransporter) {
    const user = await User.findById(shipment.assignedTransporter);
    console.log('Transporter:', JSON.stringify(user, null, 2));
  }
  process.exit(0);
}
debug();
