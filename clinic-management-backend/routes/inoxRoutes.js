const express = require('express');
const {
  createInox,
  getInoxs,
  getInoxByName,
  updateInox,
  updateInoxStock,
  deleteInox
} = require('../controllers/inoxController');

const router = express.Router();

// Use name instead of _id for these routes
router.post('/', createInox); // Create a new Inox
router.get('/', getInoxs); // Get all Inoxs
router.get('/:name', getInoxByName); // Get by name
router.put('/:name', updateInox); // Update by name
router.put('/:name/stock', updateInoxStock); // Update stock by name
router.delete('/:name', deleteInox); // Delete by name

module.exports = router;
