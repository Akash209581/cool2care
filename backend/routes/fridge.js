const express = require('express');
const router = express.Router();
const {
  getFridgeStatus,
  updateTemperature,
} = require('../controllers/fridgeController');
const { protect } = require('../middleware/auth');

router.get('/status', protect, getFridgeStatus);
router.post('/temperature', protect, updateTemperature);

module.exports = router;