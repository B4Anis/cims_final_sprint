const mongoose = require('mongoose');

// Define the Inox schema
const inoxSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true // Ensures 'name' is unique
    },
    category: String,
    brand: String,
    quantity: { 
        type: Number, 
        default: 0 
    },
    minStock: { 
        type: Number, 
        default: 0 
    },
    supplierName: String,  
    supplierContact: String,  
});

// Create the Inox model
const Inox = mongoose.model('Inox', inoxSchema);

module.exports = Inox;
