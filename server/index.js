const path = require('path'); // ← ADD at top
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // ← ADD
const shipmentRoutes = require('./routes/shipmentRoutes');
const documentRoutes = require('./routes/documentRoutes');
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/documents', documentRoutes); // ← ADD
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ← ADD


app.get('/', (req, res) => {
  res.json({
    success : true,
    message : 'Blockchain Logistics API is running 🚀',
    version : '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success   : true,
    status    : 'Server is healthy ✅',
    timestamp : new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV}`);
});