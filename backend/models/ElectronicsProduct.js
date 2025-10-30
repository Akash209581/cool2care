const mongoose = require('mongoose');

const electronicsProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    default: null, // For used items to show original price
  },
  category: {
    type: String,
    required: true,
    enum: [
      'smartphones',
      'laptops',
      'tablets',
      'headphones',
      'speakers',
      'cameras',
      'gaming',
      'wearables',
      'accessories',
      'home-appliances'
    ],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Please add brand name'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please add model name'],
    trim: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'new',
  },
  specifications: {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    camera: String,
    battery: String,
    os: String,
    connectivity: String,
    dimensions: String,
    weight: String,
    warranty: String,
    color: String,
    other: Object, // For additional specs
  },
  features: [String],
  images: [String], // Array of image URLs
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'new',
  },
  location: {
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  shipping: {
    freeShipping: {
      type: Boolean,
      default: false,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    shippingTime: String, // e.g., "3-5 days"
  },
  purchaseDate: Date, // For used items
  reasonForSelling: String, // For used items
  accessories: [String], // What's included
  views: {
    type: Number,
    default: 0,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Index for search functionality
electronicsProductSchema.index({
  name: 'text',
  title: 'text',
  description: 'text',
  brand: 'text',
  model: 'text',
});

// Update ratings when reviews are added
electronicsProductSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    {
      $match: { product: this._id }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.rating.average = stats[0].averageRating;
    this.rating.count = stats[0].ratingsCount;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }

  await this.save();
};

module.exports = mongoose.model('ElectronicsProduct', electronicsProductSchema);