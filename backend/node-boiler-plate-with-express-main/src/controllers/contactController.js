const Contact = require("../models/contactModel");

// POST /api/contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create new contact document
    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();

    res.status(200).json({ message: "Contact message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// GET /api/contact (optional: get all messages)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
