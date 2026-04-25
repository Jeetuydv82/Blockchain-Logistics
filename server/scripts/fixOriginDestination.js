/**
 * Migration Script: Fix shipments where origin/destination are stored as objects.
 * 
 * Run once: node scripts/fixOriginDestination.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Use MongoDB native query to find docs where origin or destination are objects (type 3)
    const docsWithObjectFields = await Shipment.collection.find({
      $or: [
        { origin: { $type: 3 } },
        { destination: { $type: 3 } }
      ]
    }).toArray();

    console.log(`Found ${docsWithObjectFields.length} shipments with object fields`);

    let fixedCount = 0;

    for (const doc of docsWithObjectFields) {
      const updates = {};
      
      if (typeof doc.origin === 'object' && doc.origin !== null) {
        updates.origin = doc.origin.address || doc.origin.city || JSON.stringify(doc.origin);
      }
      
      if (typeof doc.destination === 'object' && doc.destination !== null) {
        updates.destination = doc.destination.address || doc.destination.city || JSON.stringify(doc.destination);
      }

      await Shipment.collection.updateOne(
        { _id: doc._id },
        { $set: updates }
      );
      console.log(`  Fixed ${doc._id}: ${JSON.stringify(updates)}`);
      fixedCount++;
    }

    console.log(`Migration complete! Fixed ${fixedCount} shipments.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
