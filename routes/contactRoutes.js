// routes/contactRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Inline middleware to validate MongoDB ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contact ID" });
  }
  next();
}

// Routes for /api/contacts
router
  .route("/")
  /**
   * @route GET /api/contacts
   * @desc Get all contacts
   */
  .get(getContacts)

  /**
   * @route POST /api/contacts
   * @desc Create a new contact
   */
  .post(createContact);

// Routes for /api/contacts/:id
router
  .route("/:id")
  /**
   * @route GET /api/contacts/:id
   * @desc Get contact by ID
   */
  .get(validateObjectId, getContactById)

  /**
   * @route PUT /api/contacts/:id
   * @desc Update contact by ID (full update)
   */
  .put(validateObjectId, updateContact)

  /**
   * @route PATCH /api/contacts/:id
   * @desc Update contact by ID (partial update)
   */
  .patch(validateObjectId, updateContact)

  /**
   * @route DELETE /api/contacts/:id
   * @desc Delete contact by ID
   */
  .delete(validateObjectId, deleteContact);

module.exports = router;
