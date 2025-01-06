const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createCustomAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Delete the existing admin user if it exists
        await User.deleteOne({ email: 'admin@clc.com' });
        console.log('Existing admin user (if any) has been removed.');

        // Hash the new password
        const hashedPassword = await bcrypt.hash('YourPassword123!', 10); // Replace with desired password

        // Create a new admin user
        const adminUser = new User({
            userID: 'ADMIN001',
            fullName: 'System Admin',
            email: 'admin@clc.com',
            password: hashedPassword,
            phoneNumber: '1234567890',
            department: 'pharmacy', // Must be 'pharmacy', 'dentistry', or 'laboratory'
            role: 'clinicadmin', // Must be 'clinicadmin', 'department admin', or 'department user'
            lastLogin: new Date(),
            status: 'active', // Added status field with a default value of 'active'
        });

        // Save the new admin user to the database
        await adminUser.save();
        console.log('Custom admin user created successfully');
        console.log('Email: admin@clc.com');
        console.log('Password: YourPassword123!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createCustomAdmin();
