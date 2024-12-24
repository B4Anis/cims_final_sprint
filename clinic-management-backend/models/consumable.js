const mongoose = require('mongoose');

// Define the consumable schema
const consumableSchema = new mongoose.Schema({
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
    expiryDate: Date,
    supplierName: String,  
    supplierContact: String,  
});

// Create the consumable model
const Consumable = mongoose.model('Consumable', consumableSchema);

module.exports = Consumable;
