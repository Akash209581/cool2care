const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteOnReview,
  getMyReviews,
  getReviewStats,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/stats/:productId', getReviewStats);

// Protected routes
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
router.put('/:id/vote', protect, voteOnReview);

module.exports = router;