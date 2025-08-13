// models/Contact.js
const mongoose = require("mongoose");

const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^[0-9]{10}$/; // Adjust for +91, +1, etc.

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the contact's name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
      index: true, // this is fine to keep for faster searches
    },
    email: {
      type: String,
      required: [true, "Please add the contact's email"],
      lowercase: true,
      trim: true,
      match: [emailRegex, "Please enter a valid email address"],
      // removed `unique` and `index` to avoid duplicate index warning
    },
    phone: {
      type: String,
      required: [true, "Please add the contact's phone number"],
      trim: true,
      match: [phoneRegex, "Please enter a valid 10-digit phone number"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collation: { locale: "en", strength: 2 }, // case-insensitive checks
  }
);

// Virtual: "Name <email>"
contactSchema.virtual("fullInfo").get(function () {
  return `${this.name} <${this.email}>`;
});

// Case-insensitive unique email index
contactSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Contact", contactSchema);
