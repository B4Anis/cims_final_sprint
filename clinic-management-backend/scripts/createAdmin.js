const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Hash the password for the admin user
        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        // Create the admin user object with added status field
        const adminUser = new User({
            userID: 'ADMIN001',
            fullName: 'System Admin',
            email: 'admin@clinic.com',
            password: hashedPassword,
            phoneNumber: '1234567890',
            department: 'pharmacy', // Can be pharmacy, dentistry, or laboratory
            role: 'clinicadmin', // Can be clinicadmin, department admin, or department user
            lastLogin: new Date(),
            status: 'active', // Added status field with default value 'active'
        });

        // Save the admin user to the database
        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@clinic.com');
        console.log('Password: Admin123!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdmin();
