const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const sellerRoutes = require('./routes/seller');
const itemRoutes = require('./routes/items');
const fridgeRoutes = require('./routes/fridge');
const electronicsRoutes = require('./routes/electronics');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cool2care', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🍃 MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/electronics', electronicsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🧊 Cool2Care Enhanced API is running!',
    features: [
      '🧊 Smart Refrigerator Management',
      '📱 Electronics Marketplace',
      '🛒 Order Management',
      '⭐ Review System',
      '🔐 User Authentication'
    ],
    version: '2.0.0'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Documentation: http://localhost:${PORT}`);
});

module.exports = app;