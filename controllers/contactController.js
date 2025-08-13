// controllers/contactController.js
const Contact = require("../models/Contact");
const Joi = require("joi");
const mongoose = require("mongoose");

/**
 * @desc Get all contacts with pagination & search
 * @route GET /api/contacts
 * @access Public
 */
const getContacts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search?.trim() || "";

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Contact.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Create new contact
 * @route POST /api/contacts
 * @access Public
 */
const createContact = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(7).max(15).required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });

    // Prevent duplicate email or phone
    const existing = await Contact.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Contact already exists" });
    }

    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Get single contact by ID
 * @route GET /api/contacts/:id
 * @access Public
 */
const getContactById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Update contact
 * @route PUT /api/contacts/:id
 * @access Public
 */
const updateContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const schema = Joi.object({
      name: Joi.string().min(2).max(100),
      email: Joi.string().email(),
      phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(7).max(15),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedContact)
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });

    res.status(200).json({ success: true, data: updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Delete contact
 * @route DELETE /api/contacts/:id
 * @access Public
 */
const deleteContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });

    await contact.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
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
