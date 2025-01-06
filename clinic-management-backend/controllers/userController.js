const User = require('../models/user');

// CREATE: Add a new user
const createUser = async (req, res) => {
  try {
    const { userID, fullName, role, password, email, phoneNumber, department } = req.body;

    const newUser = new User({
      userID,
      fullName,
      role,
      password,
      email,
      phoneNumber,
      department
    });

    const createdUser = await newUser.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

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
    const updatedUser = await User.findOneAndUpdate(
      { email: id },
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Remove a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ email: id });

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
    const { id } = req.params;
    const { itemId, itemName, quantity, action, details } = req.body;

    const user = await User.findOne({ userID: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activity = {
      action,
      itemId,
      itemName,
      quantity,
      timestamp: new Date(),
      details
    };

    user.activityLog.push(activity);
    await user.save();

    res.status(200).json(activity);
  } catch (error) {
    console.error('Error in logInventoryActivity:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET: Retrieve user activity log
const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching activities for user:', id);
    
    const user = await User.findOne({ userID: id });
    if (!user) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user.fullName);
    console.log('Activities:', user.activityLog);
    
    res.status(200).json(user.activityLog || []);
  } catch (error) {
    console.error('Error in getUserActivity:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update the last login time for a user
const updateLastLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ lastLogin: user.lastLogin });
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
  updateLastLogin
};
