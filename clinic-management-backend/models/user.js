const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true, enum: ['clinicadmin', 'department admin', 'department user'] },
  password: { type: String, required: true },
  activityLog: { type: [String], default: [] },
  lastLogin: { type: Date, default: null },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  department: { type: String, required: true, enum: ['pharmacy', 'dentistry', 'laboratory'] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
