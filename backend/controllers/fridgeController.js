// @desc    Get fridge status
// @route   GET /api/fridge/status
// @access  Private
const getFridgeStatus = async (req, res) => {
  try {
    // Simulate fridge data - in real implementation, this would come from IoT sensors
    const fridgeData = {
      temperature: Math.floor(Math.random() * 5) + 2, // 2-6°C
      humidity: Math.floor(Math.random() * 20) + 40, // 40-60%
      powerStatus: 'on',
      doorStatus: 'closed',
      lastUpdated: new Date(),
    };

    res.json(fridgeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fridge temperature
// @route   POST /api/fridge/temperature
// @access  Private
const updateTemperature = async (req, res) => {
  try {
    const { temperature } = req.body;

    if (!temperature || temperature < -10 || temperature > 15) {
      return res.status(400).json({ message: 'Invalid temperature range' });
    }

    // In real implementation, this would send command to IoT device
    const fridgeData = {
      temperature,
      message: 'Temperature updated successfully',
      updatedAt: new Date(),
    };

    res.json(fridgeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFridgeStatus,
  updateTemperature,
};