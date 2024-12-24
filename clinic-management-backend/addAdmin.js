const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user'); // Adjust path if necessary

dotenv.config(); // Load environment variables

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Ignore the warning, safe to remove
  useUnifiedTopology: true, // Ignore the warning, safe to remove
}).then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

const addAdmin = async () => {
  try {
    
    const admin = new User({
      userID: "admin1", // Provide a valid `userID` value
      fullName: "Admin User",
      role: "department admin",
      email: "admin@example.com",
      phoneNumber: "+123456789", // Correct `phoneNumber` field
      department: "pharmacy", // Match enum value in schema (case-sensitive)
      password: "securepassword", // Use bcrypt to hash passwords in production
    });

    await admin.save();
    console.log('Admin user added successfully:', admin);
    process.exit();
  } catch (error) {
    console.error('Error adding admin user:', error);
    process.exit(1);
  }
};

addAdmin();
