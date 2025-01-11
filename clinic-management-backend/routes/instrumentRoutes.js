const express = require('express');
const {
  createInstrument,
  getInstruments,
  updateInstrument,
  deleteInstrument,
  updateInstrumentStock
} = require('../controllers/instrumentController');

const router = express.Router();

router.post('/', createInstrument);
router.get('/', getInstruments);
router.put('/:name', updateInstrument);
router.delete('/:name', deleteInstrument);
router.put('/:name/stock', updateInstrumentStock);

module.exports = router;
