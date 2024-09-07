import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create user model (firstName, lastName, email, phone, nic, dob, gender, password)
// Validate the email
// Password hashing (bcrypt)
// Compare password
// Generate JWT

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [3, "First Name contains at least 3 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      validate: [validator.isEmail, "Email is invalid"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      minLength: [10, "Phone Number must contain exactly 10 digits"],
      maxLength: [10, "Phone Number must contain exactly 10 digits"],
    },
    address: {
      line1: {
        type: String,
        required: [true, "Address line is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must contain at least 8 characters"],
      select: false,
    },
    dob: {
      type: Date,
      required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender Is Required!"],
      enum: ["Male", "Female", "Other"],
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Patient", "Doctor"],
      default: "Patient",
    },
  },
  { timestamps: true },
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate JWT
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Pre-save middleware to normalize username and email
userSchema.pre("save", function (next) {
  this.userName = this.userName.toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

export const User = mongoose.model("User", userSchema);
