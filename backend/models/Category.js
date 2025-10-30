const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add category name'],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  level: {
    type: Number,
    default: 0, // 0 = main category, 1 = subcategory, 2 = sub-subcategory
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  productCount: {
    type: Number,
    default: 0,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
}, {
  timestamps: true,
});

// Generate slug from name
categorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

// Update product count
categorySchema.methods.updateProductCount = async function() {
  const ElectronicsProduct = mongoose.model('ElectronicsProduct');
  const count = await ElectronicsProduct.countDocuments({ 
    category: this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'), 
    isActive: true 
  });
  this.productCount = count;
  await this.save();
};

module.exports = mongoose.model('Category', categorySchema);