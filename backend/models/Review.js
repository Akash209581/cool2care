const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ElectronicsProduct',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters'],
  },
  pros: [String],
  cons: [String],
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpfulVotes: {
    type: Number,
    default: 0,
  },
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    helpful: Boolean,
  }],
}, {
  timestamps: true,
});

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating after review is saved
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRating(this.product);
});

// Update product rating before review is removed
reviewSchema.pre('remove', async function() {
  await this.constructor.calcAverageRating(this.product);
});

// Calculate average rating
reviewSchema.statics.calcAverageRating = async function(productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  const ElectronicsProduct = mongoose.model('ElectronicsProduct');

  if (obj.length > 0) {
    await ElectronicsProduct.findByIdAndUpdate(productId, {
      'ratings.average': obj[0].averageRating,
      'ratings.count': obj[0].ratingsCount,
    });
  } else {
    await ElectronicsProduct.findByIdAndUpdate(productId, {
      'ratings.average': 0,
      'ratings.count': 0,
    });
  }
};

module.exports = mongoose.model('Review', reviewSchema);