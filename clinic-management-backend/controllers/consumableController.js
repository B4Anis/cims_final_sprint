const Consumable = require('../models/consumable.js');

// Create a new consumable
exports.createConsumable = async (req, res) => {
  const consumable = new Consumable(req.body);
  try {
    await consumable.save();
    res.status(201).json(consumable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all consumables
exports.getConsumables = async (req, res) => {
  try {
    const consumables = await Consumable.find();
    res.status(200).json(consumables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a consumable by name
exports.updateConsumable = async (req, res) => {
  const { name } = req.params; // Get the name from the URL parameter
  try {
    const consumable = await Consumable.findOneAndUpdate(
      { name }, 
      req.body, 
      { new: true }
    );
    if (!consumable) {
      return res.status(404).json({ message: 'Consumable not found' });
    }
    res.status(200).json(consumable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a consumable by name
exports.deleteConsumable = async (req, res) => {
  const { name } = req.params; // Get the name from the URL parameter
  try {
    const consumable = await Consumable.findOneAndDelete({ name });
    if (!consumable) {
      return res.status(404).json({ message: 'Consumable not found' });
    }
    res.status(200).json({ message: 'Consumable deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Consumable stock
exports.updateConsumableStock = async (req, res) => {
  const { name } = req.params;
  const { quantity, type } = req.body;

  try {
    const consumable = await Consumable.findOne({ name });
    
    if (!consumable) {
      return res.status(404).json({ message: 'Consumable not found' });
    }

    // Calculate new quantity
    const newQuantity = type === 'addition' 
      ? consumable.quantity + quantity
      : consumable.quantity - quantity;

    // Check if new quantity would be negative
    if (newQuantity < 0) {
      return res.status(400).json({ 
        message: 'Cannot reduce stock below 0' 
      });
    }

    // Update the quantity
    consumable.quantity = newQuantity;
    await consumable.save();

    res.status(200).json(consumable);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({ error: error.message });
  }
};
