const express = require('express');
const {
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
} = require('../controllers/sellerController');
const { protectSeller } = require('../middleware/sellerAuth');

const router = express.Router();

// Authentication routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/me', protectSeller, getSellerProfile);
router.put('/profile', protectSeller, updateSellerProfile);

// Product management routes
router.get('/products', protectSeller, getSellerProducts);
router.post('/products', protectSeller, createProduct);
router.put('/products/:id', protectSeller, updateProduct);
router.delete('/products/:id', protectSeller, deleteProduct);
router.patch('/products/:id/status', protectSeller, toggleProductStatus);

// Order management routes
router.get('/orders', protectSeller, getSellerOrders);
router.patch('/orders/:id/status', protectSeller, updateOrderStatus);

// Analytics routes
router.get('/analytics', protectSeller, getSellerAnalytics);

module.exports = router;