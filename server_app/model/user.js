const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number },
  resetPasswordExpires: { type: Date },

  role: {
    type: Number,
    enum: [0, 1, 2],
    default: 2,
  },
  avatar: {
    type: String,
  },
  postCount: { type: Number, default: 0 },
  status: {
    type: Number,
    enum: [0, 1, 2],
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
