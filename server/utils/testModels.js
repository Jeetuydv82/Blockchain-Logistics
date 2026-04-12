const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User     = require('../models/User');
const Shipment = require('../models/Shipment');

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family : 4
    });
    console.log('✅ Connected to MongoDB');

    const user = await User.create({
      name     : 'Test Admin',
      email    : 'admin@test.com',
      password : '123456',
      role     : 'admin'
    });
    console.log('✅ User created:', user.name, '| Role:', user.role);

    const shipment = await Shipment.create({
      title       : 'Test Electronics Shipment',
      createdBy   : user._id,
      origin      : { address: '123 Main St', city: 'Mumbai', country: 'India' },
      destination : { address: '456 Oak Ave', city: 'Delhi',  country: 'India' }
    });
    console.log('✅ Shipment created:', shipment.trackingNumber);

    await User.deleteMany({ email: 'admin@test.com' });
    await Shipment.deleteMany({ title: 'Test Electronics Shipment' });
    console.log('✅ Test data cleaned up');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

test();