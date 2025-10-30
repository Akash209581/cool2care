const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getSellerOrders,
  cancelOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/seller', protect, getSellerOrders);
router.get('/stats', protect, getOrderStats); // Admin only in real implementation
router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, updateOrderToDelivered);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;