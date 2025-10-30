const express = require('express');
const router = express.Router();
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getExpiringItems,
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getItems).post(protect, addItem);
router.route('/expiring').get(protect, getExpiringItems);
router.route('/:id').delete(protect, deleteItem).put(protect, updateItem);

module.exports = router;