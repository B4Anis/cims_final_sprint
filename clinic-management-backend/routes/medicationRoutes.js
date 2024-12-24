const express = require('express');
const router = express.Router();
const {
  createMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
  deleteMedication
} = require('../controllers/medicationController');

// Routes for each family
router.route('/:family')
  .get(getAllMedications)  // Fetch all medications of a family
  .post(createMedication);  // Create a new medication for a family

router.route('/:family/:id')
  .get(getMedicationById)   // Fetch a specific medication from a family
  .put(updateMedication)    // Update a medication from a family
  .delete(deleteMedication); // Delete a medication from a family

module.exports = router;
