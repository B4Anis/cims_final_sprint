const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        const adminUser = new User({
            userID: 'ADMIN001',
            fullName: 'System Admin',
            email: 'admin@clinic.com',
            password: hashedPassword,
            phoneNumber: '1234567890',
            department: 'pharmacy',
            role: 'clinicadmin',
            lastLogin: new Date()
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
