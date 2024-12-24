const Family1 = require('../models/family1');
const Family2 = require('../models/family2');
const Family3 = require('../models/family3');
const Family4 = require('../models/family4');
const Family5 = require('../models/family5');

// Helper function to get the appropriate model based on the family
const getFamilyModel = (family) => {
  switch (family) {
    case 'Family1':
      return Family1;
    case 'Family2':
      return Family2;
    case 'Family3':
      return Family3;
    case 'Family4':
      return Family4;
    case 'Family5':
      return Family5;
    default:
      throw new Error('Family not found');
  }
};

// CREATE: Add a new medication to the specified family
const createMedication = async (req, res) => {
  try {
    const { family } = req.params; // Get the family name from the URL parameter
    const FamilyModel = getFamilyModel(family); // Get the model dynamically

    const { genericName, marketName, dosage, dosageForm, expiryDate, packSize, minStockLevel, supplierName, supplierContact, quantityInStock } = req.body;

    const newMedication = new FamilyModel({
      genericName,
      marketName,
      dosage,
      dosageForm,
      expiryDate,
      packSize,
      minStockLevel,
      supplierName,
      supplierContact,
      quantityInStock
    });

    const createdMedication = await newMedication.save();
    res.status(201).json(createdMedication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ: Get all medications from a specified family
const getAllMedications = async (req, res) => {
  try {
    const { family } = req.params;
    const FamilyModel = getFamilyModel(family); // Get the model dynamically

    const medications = await FamilyModel.find();
    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get a medication by ID from a specified family
const getMedicationById = async (req, res) => {
  try {
    const { family, id } = req.params;
    const FamilyModel = getFamilyModel(family);

    const medication = await FamilyModel.findById(id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Modify an existing medication in a specified family
const updateMedication = async (req, res) => {
  try {
    const { family, id } = req.params;
    const FamilyModel = getFamilyModel(family);

    const medication = await FamilyModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json(medication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Remove a medication from a specified family
const deleteMedication = async (req, res) => {
  try {
    const { family, id } = req.params;
    const FamilyModel = getFamilyModel(family);

    const medication = await FamilyModel.findByIdAndDelete(id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
  deleteMedication
};
