const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [
        /^[0-9+\-\s()]{7,15}$/, // ✅ allows 7–15 digits, spaces, +, -, ()
        "Please enter a valid phone number (7–15 digits)",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
