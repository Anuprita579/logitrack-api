const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      validate: {
        validator(value) {
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: "Name should contain only alphabets",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: "Email is invalid",
      },
      trim: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 128,
      validate:{
        validator(value){
          return validator.isStrongPassword(value);
        },
        message: "Password is not strong enough",
      },
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "driver"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
