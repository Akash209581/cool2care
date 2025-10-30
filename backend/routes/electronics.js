const express = require('express');
const router = express.Router();
const {
  getElectronicsProducts,
  getElectronicsProduct,
  createElectronicsProduct,
  updateElectronicsProduct,
  deleteElectronicsProduct,
  getMyProducts,
  toggleFavorite,
  getCategories,
  getFeaturedProducts,
} = require('../controllers/electronicsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getElectronicsProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getElectronicsProduct);

// Protected routes
router.post('/', protect, createElectronicsProduct);
router.get('/seller/my-products', protect, getMyProducts);
router.put('/:id', protect, updateElectronicsProduct);
router.delete('/:id', protect, deleteElectronicsProduct);
router.put('/:id/favorite', protect, toggleFavorite);

module.exports = router;