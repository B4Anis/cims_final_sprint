const express = require('express');
const {
  createInox,
  getInoxs,
  updateInox,
  deleteInox
} = require('../controllers/inoxController');

const router = express.Router();

// Use name instead of _id for these routes
router.post('/', createInox); // Create a new Inox
router.get('/', getInoxs); // Get all Inoxs
router.put('/:name', updateInox); // Update by name
router.delete('/:name', deleteInox); // Delete by name

module.exports = router;
