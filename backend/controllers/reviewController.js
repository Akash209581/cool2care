const Review = require('../models/Review');
const ElectronicsProduct = require('../models/ElectronicsProduct');
const Order = require('../models/Order');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 }; // Default: newest first

    // Sort options
    if (req.query.sort === 'helpful') {
      sortOption = { helpfulVotes: -1 };
    } else if (req.query.sort === 'rating_high') {
      sortOption = { rating: -1 };
    } else if (req.query.sort === 'rating_low') {
      sortOption = { rating: 1 };
    }

    // Rating filter
    let query = { product: req.params.productId };
    if (req.query.rating) {
      query.rating = parseInt(req.query.rating);
    }

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: req.params.productId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      ratingStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, pros, cons } = req.body;

    // Check if product exists
    const product = await ElectronicsProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product (optional verification)
    const hasPurchased = await Order.findOne({
      buyer: req.user.id,
      'orderItems.product': productId,
      isPaid: true,
    });

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      isVerifiedPurchase: !!hasPurchased,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    // Update product rating
    await product.updateRating();

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Owner only)
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    // Update product rating
    const product = await ElectronicsProduct.findById(review.product);
    await product.updateRating();

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner or Admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check authorization
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const product = await ElectronicsProduct.findById(productId);
    if (product) {
      await product.updateRating();
    }

    res.json({ message: 'Review removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on review helpfulness
// @route   PUT /api/reviews/:id/vote
// @access  Private
const voteOnReview = async (req, res) => {
  try {
    const { helpful } = req.body; // true for helpful, false for not helpful
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has already voted
    const existingVoteIndex = review.votedBy.findIndex(
      vote => vote.user.toString() === req.user.id
    );

    if (existingVoteIndex !== -1) {
      // Update existing vote
      const oldVote = review.votedBy[existingVoteIndex].helpful;
      review.votedBy[existingVoteIndex].helpful = helpful;

      // Update helpful votes count
      if (oldVote && !helpful) {
        review.helpfulVotes -= 1;
      } else if (!oldVote && helpful) {
        review.helpfulVotes += 1;
      }
    } else {
      // Add new vote
      review.votedBy.push({
        user: req.user.id,
        helpful,
      });

      if (helpful) {
        review.helpfulVotes += 1;
      }
    }

    await review.save();

    res.json({
      message: 'Vote recorded',
      helpfulVotes: review.helpfulVotes,
      userVote: helpful,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'title images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ user: req.user.id });

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats/:productId
// @access  Public
const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: req.params.productId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      distribution[rating]++;
    });

    res.json({
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingDistribution: distribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteOnReview,
  getMyReviews,
  getReviewStats,
};