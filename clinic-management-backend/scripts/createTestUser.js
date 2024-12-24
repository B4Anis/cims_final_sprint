const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('test123', 10);

        const testUser = new User({
            userID: 'TEST001',
            fullName: 'Test User',
            email: 'test@test.com',
            password: hashedPassword,
            phoneNumber: '1234567890',
            department: 'pharmacy',
            role: 'department user',
            lastLogin: new Date()
        });

        await testUser.save();
        console.log('Test user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();
