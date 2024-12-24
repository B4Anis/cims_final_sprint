const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addActivityLog,
  updateLastLogin
} = require('../controllers/userController');

// CRUD routes for user management
router.route('/')
  .get(getAllUsers)  // Fetch all users
  .post(createUser); // Create a new user

router.route('/:id')
  .get(getUserById)   // Fetch a user by ID
  .put(updateUser)    // Update a user
  .delete(deleteUser); // Delete a user

// Additional routes for managing user activities and last login
router.route('/:id/activity')
  .post(addActivityLog);  // Add activity log for a user

router.route('/:id/lastlogin')
  .put(updateLastLogin);  // Update last login time for a user

module.exports = router;
