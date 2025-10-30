const Item = require('../models/Item');

// Category-based expiry days with specific item overrides
const CATEGORY_EXPIRY_DAYS = {
  fruit: 7,      // Default for fruits: 7 days
  vegetable: 10, // Default for vegetables: 10 days  
  dairy: 5,      // Default for dairy: 5 days
  meat: 3,       // Default for meat: 3 days (refrigerated)
  other: null    // Custom expiry date required
};

// Specific item expiry overrides (in days)
const ITEM_EXPIRY_OVERRIDES = {
  // Fruits
  banana: 4,
  apple: 14,
  orange: 10,
  mango: 5,
  grapes: 7,
  strawberry: 3,
  berries: 3,
  watermelon: 7,
  pineapple: 5,
  avocado: 5,
  lemon: 21,
  lime: 21,

  // Vegetables  
  tomato: 7,
  carrot: 30,
  potato: 45,
  onion: 30,
  lettuce: 5,
  broccoli: 7,
  spinach: 5,
  cucumber: 7,
  bellpepper: 7,
  garlic: 60,
  ginger: 21,
  mushroom: 5,

  // Dairy
  milk: 5,
  yogurt: 7,
  cheese: 14,
  butter: 21,
  cream: 3,
  eggs: 21,

  // Meat
  chicken: 2,
  beef: 3,
  pork: 3,
  fish: 1,
  seafood: 1,
  bacon: 7,
  sausage: 7,
  'ground meat': 1,
  'deli meat': 5
};

// @desc    Get all items for a user
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new item
// @route   POST /api/items
// @access  Private
const addItem = async (req, res) => {
  try {
    const { name, category, quantity, notes, customExpiryDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please add an item name' });
    }

    const itemName = name.toLowerCase().trim();
    const itemCategory = category || 'other';
    let expiryDate;

    // Handle expiry date calculation
    if (itemCategory === 'other' && customExpiryDate) {
      // For "other" category, use custom expiry date provided by user
      expiryDate = new Date(customExpiryDate);
      
      // Validate the custom expiry date
      if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
        return res.status(400).json({ 
          message: 'Please provide a valid future expiry date for other items' 
        });
      }
    } else {
      // Calculate expiry date based on item name or category
      let expiryDays;
      
      // First check for specific item override
      if (ITEM_EXPIRY_OVERRIDES[itemName]) {
        expiryDays = ITEM_EXPIRY_OVERRIDES[itemName];
      } else {
        // Use category default
        expiryDays = CATEGORY_EXPIRY_DAYS[itemCategory];
        
        // If category doesn't have default (like 'other'), require custom date
        if (expiryDays === null) {
          return res.status(400).json({ 
            message: 'Please provide an expiry date for this item' 
          });
        }
      }

      const addedDate = new Date();
      expiryDate = new Date();
      expiryDate.setDate(addedDate.getDate() + expiryDays);
    }

    const item = await Item.create({
      user: req.user.id,
      name: itemName,
      category: itemCategory,
      addedDate: new Date(),
      expiryDate,
      quantity: quantity || 1,
      notes: notes || '',
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Make sure user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Make sure user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get items expiring soon
// @route   GET /api/items/expiring
// @access  Private
const getExpiringItems = async (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const expiringItems = await Item.find({
      user: req.user.id,
      expiryDate: { $lte: threeDaysFromNow, $gte: today },
    }).sort({ expiryDate: 1 });

    res.json(expiringItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getExpiringItems,
};