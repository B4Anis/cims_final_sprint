const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verify JWT token middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Check if user is clinic admin
const isClinicAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role === 'clinicadmin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Clinic admin rights required.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if user is department admin or clinic admin
const isDepartmentAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role === 'clinicadmin' || user.role === 'department admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admin rights required.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if user belongs to specific department
const isDepartmentMember = (department) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (user.role === 'clinicadmin' || user.department === department) {
                next();
            } else {
                res.status(403).json({ message: `Access denied. ${department} department access required.` });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

module.exports = {
    auth,
    isClinicAdmin,
    isDepartmentAdmin,
    isDepartmentMember
};