const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  genericName: { type: String, required: true },
  marketName: { type: String, required: true },
  dosage: { type: String, required: true },
  dosageForm: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  packSize: { type: String, required: true },
  minStockLevel: { type: Number, required: true },
  supplierName: { type: String },
  supplierContact: { type: String },
  quantityInStock: { type: Number, required: true },
});
//zyefbzeuibfu
module.exports = mongoose.model("Family5", medicationSchema); // Repeat for Family2, Family3, etc.
