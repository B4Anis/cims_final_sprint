const NonConsumable = require('../models/nonconsumables.js');

// Create a new NonConsumable
exports.createNonConsumable = async (req, res) => {
  const nonConsumable = new NonConsumable(req.body);
  try {
    await nonConsumable.save();
    res.status(201).json(nonConsumable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all NonConsumables
exports.getNonConsumables = async (req, res) => {
  try {
    const nonConsumables = await NonConsumable.find();
    res.status(200).json(nonConsumables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a NonConsumable by name
exports.updateNonConsumable = async (req, res) => {
  const { name } = req.params;
  try {
    const nonConsumable = await NonConsumable.findOneAndUpdate(
      { name }, 
      req.body,
      { new: true }
    );
    if (!nonConsumable) {
      return res.status(404).json({ message: 'NonConsumable not found' });
    }
    res.status(200).json(nonConsumable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a NonConsumable by name
exports.deleteNonConsumable = async (req, res) => {
  const { name } = req.params;
  try {
    const nonConsumable = await NonConsumable.findOneAndDelete({ name });
    if (!nonConsumable) {
      return res.status(404).json({ message: 'NonConsumable not found' });
    }
    res.status(200).json({ message: 'NonConsumable deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update NonConsumable stock
exports.updateNonConsumableStock = async (req, res) => {
  const { name } = req.params;
  const { quantity, type } = req.body;

  try {
    const nonConsumable = await NonConsumable.findOne({ name });
    
    if (!nonConsumable) {
      return res.status(404).json({ message: 'NonConsumable not found' });
    }

    // Calculate new quantity
    const newQuantity = type === 'addition' 
      ? nonConsumable.quantity + quantity
      : nonConsumable.quantity - quantity;

    // Check if new quantity would be negative
    if (newQuantity < 0) {
      return res.status(400).json({ 
        message: 'Cannot reduce stock below 0' 
      });
    }

    // Update the quantity
    nonConsumable.quantity = newQuantity;
    await nonConsumable.save();

    res.status(200).json(nonConsumable);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({ error: error.message });
  }
};
