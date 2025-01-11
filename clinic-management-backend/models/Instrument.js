const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: {  
    type: String, 
    required: [true, 'Name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  modelNumber: {
    type: String,
    required: [true, 'Model number is required'],
    trim: true
  },
  quantity: { 
    type: Number, 
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  minStock: { 
    type: Number, 
    default: 0,
    min: [0, 'Minimum stock cannot be negative']
  },
  dateAcquired: {
    type: Date,
    default: Date.now
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  supplierContact: {
    type: String,
    required: [true, 'Supplier contact is required'],
    trim: true
  }
}, {
  timestamps: true
});

// The unique: true option already creates an index on the name field
const Instrument = mongoose.model('Instrument', instrumentSchema);

module.exports = Instrument;
