const express = require('express');
const router = express.Router();
const { login, register, getCurrentUser } = require('../controllers/authController');
const { auth, isClinicAdmin } = require('../middlewares/authMiddleware');

// Login route
router.post('/login', login);

// Register route (protected, only clinic admin can register new users)
router.post('/register', auth, isClinicAdmin, register);

// Get current user route
router.get('/me', auth, getCurrentUser);

module.exports = router;
