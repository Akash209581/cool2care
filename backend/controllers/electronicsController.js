const ElectronicsProduct = require('../models/ElectronicsProduct');
const User = require('../models/User');

// @desc    Get all electronics products with filters and search
// @route   GET /api/electronics
// @access  Public
const getElectronicsProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    let query = { isActive: true };

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = { $regex: req.query.brand, $options: 'i' };
    }

    // Condition filter
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Location filter
    if (req.query.location) {
      query['location.city'] = { $regex: req.query.location, $options: 'i' };
    }

    // Sorting
    let sortOption = {};
    switch (req.query.sort) {
      case 'price_low':
        sortOption.price = 1;
        break;
      case 'price_high':
        sortOption.price = -1;
        break;
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'oldest':
        sortOption.createdAt = 1;
        break;
      case 'rating':
        sortOption['ratings.average'] = -1;
        break;
      case 'popular':
        sortOption.views = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const products = await ElectronicsProduct.find(query)
      .populate('seller', 'name email sellerProfile.rating')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await ElectronicsProduct.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single electronics product
// @route   GET /api/electronics/:id
// @access  Public
const getElectronicsProduct = async (req, res) => {
  try {
    const product = await ElectronicsProduct.findById(req.params.id)
      .populate('seller', 'name email phone sellerProfile')
      .populate({
        path: 'favorites',
        select: 'name',
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new electronics product
// @route   POST /api/electronics
// @access  Private (Sellers)
const createElectronicsProduct = async (req, res) => {
  try {
    const product = await ElectronicsProduct.create({
      ...req.body,
      seller: req.user.id,
    });

    const populatedProduct = await ElectronicsProduct.findById(product._id)
      .populate('seller', 'name email sellerProfile.rating');

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update electronics product
// @route   PUT /api/electronics/:id
// @access  Private (Owner only)
const updateElectronicsProduct = async (req, res) => {
  try {
    const product = await ElectronicsProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Make sure user owns the product
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedProduct = await ElectronicsProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('seller', 'name email sellerProfile.rating');

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete electronics product
// @route   DELETE /api/electronics/:id
// @access  Private (Owner only)
const deleteElectronicsProduct = async (req, res) => {
  try {
    const product = await ElectronicsProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Make sure user owns the product
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await ElectronicsProduct.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's products (seller dashboard)
// @route   GET /api/electronics/my-products
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await ElectronicsProduct.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ElectronicsProduct.countDocuments({ seller: req.user.id });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle favorite product
// @route   PUT /api/electronics/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const product = await ElectronicsProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isFavorited = product.favorites.includes(req.user.id);

    if (isFavorited) {
      product.favorites.pull(req.user.id);
    } else {
      product.favorites.push(req.user.id);
    }

    await product.save();

    res.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get categories with product counts
// @route   GET /api/electronics/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await ElectronicsProduct.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/electronics/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await ElectronicsProduct.find({
      isFeatured: true,
      isActive: true,
    })
      .populate('seller', 'name sellerProfile.rating')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getElectronicsProducts,
  getElectronicsProduct,
  createElectronicsProduct,
  updateElectronicsProduct,
  deleteElectronicsProduct,
  getMyProducts,
  toggleFavorite,
  getCategories,
  getFeaturedProducts,
};