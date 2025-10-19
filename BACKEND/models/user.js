const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // extra security: don't return by default
  role: { type: String, enum: ["student", "admin", "teacher"], default: "student" },
  rollNumber: { type: Number, unique: true, sparse: true },
  department: { type: String },
  year: { type: String }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
