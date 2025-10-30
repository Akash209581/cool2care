const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add an item name'],
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['fruit', 'vegetable', 'dairy', 'meat', 'other'],
    default: 'other',
  },
  addedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Calculate expiry status before saving
itemSchema.pre('save', function(next) {
  this.isExpired = new Date() > this.expiryDate;
  next();
});

module.exports = mongoose.model('Item', itemSchema);