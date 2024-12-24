const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { checkStockAndExpiry } = require('./controllers/notificationController');
const consumableRoutes = require('./routes/consumableRoutes');
const nonconsumableRoutes = require('./routes/nonconsumableRoutes');
const inoxRoutes = require('./routes/inoxRoutes');
const instrumentRoutes = require('./routes/instrumentRoutes');
const authRoutes = require('./routes/authRoutes'); // Add this line

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// CORS setup: Allow frontend on localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware for JSON parsing
app.use(express.json());

// Define routes 
app.use('/api/auth', authRoutes); // Add this line
app.use('/api/users', userRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/consumables', consumableRoutes);
app.use('/api/non-consumables', nonconsumableRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/instrument', instrumentRoutes);
app.use('/api/inox',inoxRoutes);

// Start periodic check for notifications
const NOTIFICATION_INTERVAL = 24 * 60 * 60 * 1000; // Runs every 24 hours
setInterval(checkStockAndExpiry, NOTIFICATION_INTERVAL);

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});