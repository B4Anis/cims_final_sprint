const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login controller hi

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is suspended
        if (user.status === 'suspended') {
            return res.status(403).json({ message: 'Account is suspended. Please contact your administrator.' });
        }

        // Check if user is inactive
        if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Account is inactive. Please contact your administrator.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { 
                id: user._id,
                role: user.role,
                department: user.department
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                department: user.department,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register new user (only accessible by clinic admin)
const register = async (req, res) => {
    try {
        const { userID, fullName, role, password, email, phoneNumber, department } = req.body;

        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { userID }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            userID,
            fullName,
            role,
            password: hashedPassword,
            email,
            phoneNumber,
            department
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    register,
    getCurrentUser
};
