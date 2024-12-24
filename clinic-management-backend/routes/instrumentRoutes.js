const express = require('express');
const {
  createInstrument,
  getInstruments,
  updateInstrument,
  deleteInstrument
} = require('../controllers/instrumentController');

const router = express.Router();

router.post('/', createInstrument);
router.get('/', getInstruments);
router.put('/:id', updateInstrument);
router.delete('/:id', deleteInstrument);

module.exports = router;
