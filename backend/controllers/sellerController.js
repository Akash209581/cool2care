const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, type: 'seller' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register seller
// @route   POST /api/seller/register
// @access  Public
const registerSeller = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      businessName, 
      businessType, 
      businessDescription,
      businessAddress 
    } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !businessName) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, phone, and business name' 
      });
    }

    if (!businessAddress || !businessAddress.address || !businessAddress.city || !businessAddress.state || !businessAddress.postalCode) {
      return res.status(400).json({ 
        message: 'Please provide complete business address details' 
      });
    }

    // Check if seller exists
    const sellerExists = await Seller.findOne({ email });

    if (sellerExists) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    // Create seller
    const seller = await Seller.create({
      name,
      email,
      password,
      phone,
      businessName,
      businessType,
      businessDescription,
      businessAddress
    });

    if (seller) {
      res.status(201).json({
        _id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        businessName: seller.businessName,
        businessType: seller.businessType,
        businessDescription: seller.businessDescription,
        businessAddress: seller.businessAddress,
        isVerified: seller.isVerified,
        token: generateToken(seller._id),
        userType: 'seller',
      });
    } else {
      res.status(400).json({ message: 'Invalid seller data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate seller & get token
// @route   POST /api/seller/login
// @access  Public
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for seller
    const seller = await Seller.findOne({ email }).select('+password');

    if (seller && (await seller.matchPassword(password))) {
      res.json({
        _id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        businessName: seller.businessName,
        businessType: seller.businessType,
        businessDescription: seller.businessDescription,
        businessAddress: seller.businessAddress,
        isVerified: seller.isVerified,
        token: generateToken(seller._id),
        userType: 'seller',
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller profile
// @route   GET /api/seller/me
// @access  Private/Seller
const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id);
    
    if (seller) {
      res.json({
        _id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        businessName: seller.businessName,
        businessType: seller.businessType,
        businessDescription: seller.businessDescription,
        businessAddress: seller.businessAddress,
        isVerified: seller.isVerified,
        userType: 'seller',
      });
    } else {
      res.status(404).json({ message: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id);

    if (seller) {
      seller.name = req.body.name || seller.name;
      seller.phone = req.body.phone || seller.phone;
      seller.businessName = req.body.businessName || seller.businessName;
      seller.businessType = req.body.businessType || seller.businessType;
      seller.businessDescription = req.body.businessDescription || seller.businessDescription;
      seller.businessAddress = req.body.businessAddress || seller.businessAddress;

      const updatedSeller = await seller.save();

      res.json({
        _id: updatedSeller.id,
        name: updatedSeller.name,
        email: updatedSeller.email,
        phone: updatedSeller.phone,
        businessName: updatedSeller.businessName,
        businessType: updatedSeller.businessType,
        businessDescription: updatedSeller.businessDescription,
        businessAddress: updatedSeller.businessAddress,
        policies: updatedSeller.policies,
        userType: 'seller',
      });
    } else {
      res.status(404).json({ message: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
  try {
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    const products = await ElectronicsProduct.find({ seller: req.seller.id })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/seller/products
// @access  Private/Seller
const createProduct = async (req, res) => {
  try {
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    
    const productData = {
      ...req.body,
      seller: req.seller.id
    };

    const product = await ElectronicsProduct.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateProduct = async (req, res) => {
  try {
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    
    const product = await ElectronicsProduct.findOne({
      _id: req.params.id,
      seller: req.seller.id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await ElectronicsProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteProduct = async (req, res) => {
  try {
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    
    const product = await ElectronicsProduct.findOne({
      _id: req.params.id,
      seller: req.seller.id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await ElectronicsProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product status
// @route   PATCH /api/seller/products/:id/status
// @access  Private/Seller
const toggleProductStatus = async (req, res) => {
  try {
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    
    const product = await ElectronicsProduct.findOne({
      _id: req.params.id,
      seller: req.seller.id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = req.body.isActive;
    await product.save();

    res.json({ isActive: product.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    
    // Get all seller's products
    const sellerProducts = await ElectronicsProduct.find({ seller: req.seller.id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // Find orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
    .populate('user', 'name email')
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 });

    // Filter items to only include seller's products
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => productIds.some(id => id.equals(item.product._id)))
    }));

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/seller/orders/:id/status
// @access  Private/Seller
const updateOrderStatus = async (req, res) => {
  try {
    const Order = require('../models/Order');
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    order.updatedAt = new Date();
    await order.save();

    res.json({ status: order.status, updatedAt: order.updatedAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller analytics
// @route   GET /api/seller/analytics
// @access  Private/Seller
const getSellerAnalytics = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const ElectronicsProduct = require('../models/ElectronicsProduct');
    const Review = require('../models/Review');
    
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get seller's products
    const sellerProducts = await ElectronicsProduct.find({ seller: req.seller.id });
    const productIds = sellerProducts.map(p => p._id);

    // Get orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds },
      createdAt: { $gte: startDate }
    }).populate('items.product');

    // Calculate analytics
    const analytics = {
      revenue: {
        total: 0,
        growth: 0
      },
      orders: {
        total: orders.length,
        growth: 0
      },
      productsSold: {
        total: 0,
        growth: 0
      },
      averageOrderValue: 0,
      conversionRate: 0,
      returnRate: 0,
      averageRating: 0,
      totalReviews: 0,
      topCategories: [],
      topProducts: []
    };

    // Calculate revenue and products sold
    let totalRevenue = 0;
    let totalProductsSold = 0;
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.some(id => id.equals(item.product._id))) {
          totalRevenue += item.price * item.quantity;
          totalProductsSold += item.quantity;
        }
      });
    });

    analytics.revenue.total = totalRevenue;
    analytics.productsSold.total = totalProductsSold;
    analytics.averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Get product categories
    const categoryCount = {};
    sellerProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + (product.sold || 0);
    });

    analytics.topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ _id: category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get top products
    analytics.topProducts = sellerProducts
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5)
      .map(product => ({
        _id: product._id,
        name: product.name,
        category: product.category,
        images: product.images,
        sold: product.sold || 0,
        revenue: (product.sold || 0) * product.price
      }));

    // Get reviews for seller's products
    const reviews = await Review.find({ product: { $in: productIds } });
    analytics.totalReviews = reviews.length;
    analytics.averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
};