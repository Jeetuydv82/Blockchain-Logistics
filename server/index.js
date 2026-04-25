const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://blockchain-logistics-4yw7.vercel.app', process.env.CLIENT_URL],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://jeetuy518_db_user:Jeetu82@cluster0.bq62bat.mongodb.net/blockchain-logistics';
const CLIENT_URL = process.env.CLIENT_URL;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.MONGO_URI) {
      console.log('⚠️  WARNING: Using default MongoDB URI. Set MONGO_URI for production.');
    }
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});