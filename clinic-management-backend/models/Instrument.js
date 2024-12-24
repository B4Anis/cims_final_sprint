const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: {  
    type: String, 
    required: true, 
    unique: true 
   },
  category: String,
  modelNumber: String,
  quantity: { 
      type: Number, 
      default: 0 
  },
  minStock: { 
      type: Number, 
      default: 0 
  },

  dateAcquired: Date,
  supplierName: String,  
  supplierContact: String,  
});


const Instrument = mongoose.model('Instrument', instrumentSchema);

module.exports = Instrument;
