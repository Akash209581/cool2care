const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  // Business Information
  businessName: {
    type: String,
    required: [true, 'Please add a business name'],
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['individual', 'business', 'company'],
    default: 'individual',
    required: true,
  },
  businessDescription: {
    type: String,
    trim: true,
  },
  businessAddress: {
    address: {
      type: String,
      required: [true, 'Please add a business address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    postalCode: {
      type: String,
      required: [true, 'Please add a postal code'],
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      default: 'India',
    },
  },
  // Rating and Performance
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
  totalSales: {
    type: Number,
    default: 0,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Business Policies
  policies: {
    returnPolicy: {
      type: String,
      default: 'No returns accepted',
    },
    shippingPolicy: {
      type: String,
      default: 'Standard shipping applies',
    },
    warrantyPolicy: {
      type: String,
      default: 'No warranty provided',
    },
  },
  // Financial Information
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String,
  },
  // Legal Documents
  documents: {
    gstNumber: String,
    panNumber: String,
    aadhaarNumber: String,
    businessLicense: String,
  },
  // Seller Statistics
  stats: {
    totalOrders: {
      type: Number,
      default: 0,
    },
    pendingOrders: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
sellerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match seller entered password to hashed password in database
sellerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Seller', sellerSchema);