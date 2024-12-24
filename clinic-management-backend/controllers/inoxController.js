const Inox = require('../models/Inox.js');

// Create a new Inox
exports.createInox = async (req, res) => {
  const inox = new Inox(req.body);
  try {
    await inox.save();
    res.status(201).json(inox);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Inoxs
exports.getInoxs = async (req, res) => {
  try {
    const inoxs = await Inox.find();
    res.status(200).json(inoxs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Inox by name
exports.getInoxByName = async (req, res) => {
  const { name } = req.params;
  try {
    const inox = await Inox.findOne({ name });
    if (!inox) {
      return res.status(404).json({ message: 'Inox not found' });
    }
    res.status(200).json(inox);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Inox by name
exports.updateInox = async (req, res) => {
  const { name } = req.params;
  try {
    const inox = await Inox.findOneAndUpdate(
      { name }, 
      req.body,
      { new: true }
    );
    if (!inox) {
      return res.status(404).json({ message: 'Inox not found' });
    }
    res.status(200).json(inox);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Inox by name
exports.deleteInox = async (req, res) => {
  const { name } = req.params;
  try {
    const inox = await Inox.findOneAndDelete({ name });
    if (!inox) {
      return res.status(404).json({ message: 'Inox not found' });
    }
    res.status(200).json({ message: 'Inox deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
