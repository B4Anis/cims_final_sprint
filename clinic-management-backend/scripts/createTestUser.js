const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Hash the test password
        const hashedPassword = await bcrypt.hash('test123', 10);

        // Define the test user details
        const testUser = new User({
            userID: 'TEST001',
            fullName: 'Test User',
            email: 'test@test.com',
            password: hashedPassword,
            phoneNumber: '1234567890',
            department: 'pharmacy', // Must be 'pharmacy', 'dentistry', or 'laboratory'
            role: 'department user', // Must be 'clinicadmin', 'department admin', or 'department user'
            lastLogin: new Date(),
            status: 'active' // New status field, default is 'active'
        });

        // Save the user to the database
        await testUser.save();
        console.log('Test user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error.message);
        process.exit(1);
    }
};

createTestUser();
