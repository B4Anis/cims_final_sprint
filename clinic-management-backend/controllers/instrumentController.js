const Instrument = require('../models/instrument');

// Create a new instrument
exports.createInstrument = async (req, res) => {
  const instrument = new Instrument(req.body);
  try {
    await instrument.save();
    res.status(201).json(instrument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all instruments
exports.getInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find();
    res.status(200).json(instruments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an instrument by ID
exports.updateInstrument = async (req, res) => {
  try {
    const instrument = await Instrument.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }
    res.status(200).json(instrument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an instrument by name
exports.deleteInstrument = async (req, res) => {
  const { name } = req.params; // Get the name from the URL parameter
  try {
    const instrument = await Instrument.findOneAndDelete({ name });
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }
    res.status(200).json({ message: 'Instrument deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
