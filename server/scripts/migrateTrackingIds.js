/**
 * Migration Script: Add trackingId to old shipments that don't have one.
 * 
 * Run once:  node scripts/migrateTrackingIds.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const shipmentsWithoutId = await Shipment.find({
      $or: [
        { trackingId: { $exists: false } },
        { trackingId: null },
        { trackingId: '' }
      ]
    });

    console.log(`Found ${shipmentsWithoutId.length} shipments without trackingId`);

    for (const doc of shipmentsWithoutId) {
      const suffix = doc._id.toString().slice(-6).toUpperCase();
      const trackingId = `SHP-${suffix}-OLD`;
      await Shipment.updateOne(
        { _id: doc._id },
        { $set: { trackingId } }
      );
      console.log(`  Updated ${doc._id} → ${trackingId}`);
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
