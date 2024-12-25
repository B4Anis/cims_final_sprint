const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createCustomAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // First, delete the existing user if it exists
        await User.deleteOne({ email: 'admin@clc.com' });

        // Create new password hash
        const hashedPassword = await bcrypt.hash('YourPassword123!', 10); // Replace with desired password

        const adminUser = new User({
            userID: 'ADMIN001',
            fullName: 'System Admin',
            email: 'admin@clc.com',
            password: hashedPassword,
            phoneNumber: '1234567890',
            department: 'pharmacy',
            role: 'clinicadmin',
            lastLogin: new Date()
        });

        await adminUser.save();
        console.log('Custom admin user created successfully');
        console.log('Email: admin@clc.com');
        console.log('Password: YourPassword123!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createCustomAdmin();
