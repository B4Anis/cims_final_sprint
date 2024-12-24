const mongoose = require('mongoose');

// Define the NonConsumable schema
const nonconsumableSchema = new mongoose.Schema({
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

// Create the NonConsumable model
const NonConsumable = mongoose.model('NonConsumable', nonconsumableSchema);

module.exports = NonConsumable;
