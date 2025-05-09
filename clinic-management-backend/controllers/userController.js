const User = require('../models/user');

// CREATE: Add a new user
const createUser = async (req, res) => {
  try {
    const { userID, fullName, role, password, email, phoneNumber, department, status } = req.body;

    const newUser = new User({
      userID,
      fullName,
      role,
      password,
      email,
      phoneNumber,
      department,
      status: status || 'active', // Default to 'active' if not provided
    });

    const createdUser = await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      user: createdUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.id }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Modify an existing user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findOneAndUpdate({ userID: id }, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Remove a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({ userID: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD: Log inventory activity for a user
const logInventoryActivity = async (req, res) => {
  try {
    const { id } = req.params;  // This is the userID
    const { action, itemId, itemName, quantity, details } = req.body;

    console.log('Looking for user with ID:', id);
    const user = await User.findOne({ userID: id });
    
    if (!user) {
      console.log('User not found with userID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    const activityLog = {
      action,
      itemId,
      itemName,
      quantity,
      details,
      timestamp: new Date()
    };

    user.activityLog.push(activityLog);
    await user.save();

    res.status(200).json(activityLog);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET: Retrieve user activity log
const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;  // This is the userID

    console.log('Fetching activities for user with ID:', id);
    const user = await User.findOne({ userID: id });
    
    if (!user) {
      console.log('User not found with userID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.activityLog || []);
  } catch (error) {
    console.error('Error getting user activity:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update the last login time for a user
const updateLastLogin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ userID: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: 'Last login updated successfully',
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  logInventoryActivity,
  getUserActivity,
  updateLastLogin,
};
