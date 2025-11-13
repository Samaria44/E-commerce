const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// POST contact form
router.post("/", contactController.createContact);

// GET all contacts (optional)
router.get("/", contactController.getAllContacts);

module.exports = router;
