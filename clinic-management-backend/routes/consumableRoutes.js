const express = require('express');
const {
  createConsumable,
  getConsumables,
  updateConsumable,
  deleteConsumable
} = require('../controllers/consumableController');

const router = express.Router();

// Use name instead of _id for these routes
router.post('/', createConsumable); // Create a new consumable
router.get('/', getConsumables); // Get all consumables
router.put('/:name', updateConsumable); // Update by name
router.delete('/:name', deleteConsumable); // Delete by name

module.exports = router;
