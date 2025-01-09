const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config({ path: '../.env' });

const createUser = async (userData) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email: userData.email }, { userID: userData.userID }] 
        });
        
        if (existingUser) {
            console.error('User with this email or userID already exists');
            process.exit(1);
        }

        // Create new password hash
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = new User({
            userID: userData.userID,
            fullName: userData.fullName,
            email: userData.email,
            password: hashedPassword,
            phoneNumber: userData.phoneNumber,
            department: userData.department,
            role: userData.role,
            status: userData.status || 'active', // Default to 'active' if status is not provided
            lastLogin: new Date()
        });

        await user.save();
        console.log('User created successfully');
        console.log('Email:', userData.email);
        console.log('Password:', userData.password);
        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error);
        console.error('Make sure:');
        console.error('1. Role is one of: clinicadmin, department admin, department user');
        console.error('2. Department is one of: pharmacy, dentistry, laboratory');
        console.error('3. Email and userID are unique');
        process.exit(1);
    }
};

// Example usage:
const newUser = {
    userID: 'USER003',          // Change this
    fullName: 'Test User1',     // Change this
    email: 'user1@test.com',    // Change this
    password: 'Password123!',   // Change this
    phoneNumber: '1234567890',  // Change this
    department: 'pharmacy',     // Must be: pharmacy, dentistry, or laboratory
    role: 'clinicadmin',        // Must be: clinicadmin, department admin, or department user
    status: 'active'            // Optional, defaults to 'active'
};

createUser(newUser);
