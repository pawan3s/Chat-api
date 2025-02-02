const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username!"],
      min: 3,
      max: 20,
      unique: [true, "Please provide a unique username"],
    },
    full_Name: {
      type: String,
      required: [true, "Please enter your fullName!"],
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      max: 50,
      unique: [true, "User exists with that email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be minimum of 8 lengths"],
      select: false,
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/da3akj2d8/image/upload/v1737995366/Profile_pictures/gp7mzdcrq4ympwk4kgmp.png",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
