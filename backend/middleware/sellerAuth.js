const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

const protectSeller = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is for seller
      if (decoded.type !== 'seller') {
        return res.status(401).json({ message: 'Not authorized as seller' });
      }

      // Get seller from the token
      req.seller = await Seller.findById(decoded.id).select('-password');

      if (!req.seller) {
        return res.status(401).json({ message: 'Seller not found' });
      }

      if (!req.seller.isActive) {
        return res.status(401).json({ message: 'Seller account is deactivated' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectSeller };