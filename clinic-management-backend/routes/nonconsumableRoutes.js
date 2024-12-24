const express = require('express');
const {
  createNonConsumable,
  getNonConsumables,
  updateNonConsumable,
  deleteNonConsumable
} = require('../controllers/nonconsumableController');

const router = express.Router();

// Use name instead of _id for these routes
router.post('/', createNonConsumable); // Create a new NonConsumable
router.get('/', getNonConsumables); // Get all NonConsumables
router.put('/:name', updateNonConsumable); // Update by name
router.delete('/:name', deleteNonConsumable); // Delete by name

module.exports = router;
