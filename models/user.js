const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: { // Add the role field
    type: String,
    enum: ["user", "admin"], // Roles can be user or admin
    default: "user", // Default role is user
  },
  bookedTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
});

// Add a method to compare passwords
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Check if the model already exists to avoid overwriting
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
