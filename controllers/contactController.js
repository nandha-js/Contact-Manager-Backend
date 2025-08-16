// controllers/contactController.js
const Contact = require("../models/Contact");
const Joi = require("joi");
const mongoose = require("mongoose");

/**
 * @desc Get all contacts
 * @route GET /api/contacts
 * @access Public
 */
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ name: 1 });
    res.status(200).json(contacts); // return array directly
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Create a new contact
 * @route POST /api/contacts
 * @access Public
 */
const createContact = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .min(7)
        .max(15)
        .required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    // Normalize input
    const email = req.body.email.trim().toLowerCase();
    const phone = req.body.phone.trim();
    const name = req.body.name.trim();

    // Check for duplicate email or phone
    const existing = await Contact.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      let conflictField = existing.email === email ? "Email" : "Phone";
      return res.status(409).json({
        success: false,
        message: `${conflictField} already exists`,
      });
    }

    const contact = await Contact.create({ name, email, phone });
    res.status(201).json(contact); // return created contact directly
  } catch (error) {
    console.error("Error creating contact:", error);

    // Handle MongoDB duplicate key error if schema has unique: true
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Get a contact by ID
 * @route GET /api/contacts/:id
 * @access Public
 */
const getContactById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Update a contact
 * @route PUT /api/contacts/:id
 * @access Public
 */
const updateContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const schema = Joi.object({
      name: Joi.string().min(2).max(100),
      email: Joi.string().email(),
      phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(7).max(15),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const updates = { ...req.body };
    if (updates.email) updates.email = updates.email.trim().toLowerCase();
    if (updates.phone) updates.phone = updates.phone.trim();
    if (updates.name) updates.name = updates.name.trim();

    // Check duplicate email/phone excluding current contact
    if (updates.email || updates.phone) {
      const existing = await Contact.findOne({
        $or: [{ email: updates.email }, { phone: updates.phone }],
        _id: { $ne: req.params.id },
      });

      if (existing) {
        let conflictField = existing.email === updates.email ? "Email" : "Phone";
        return res.status(409).json({
          success: false,
          message: `${conflictField} already in use`,
        });
      }
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Delete a contact
 * @route DELETE /api/contacts/:id
 * @access Public
 */
const deleteContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    await contact.deleteOne();
    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
