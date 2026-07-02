const express = require("express");
const router  = express.Router();
const { handleMessage } = require("../controllers/chatbotController");

// POST /chatbot/message  — receives { message } returns { reply }
router.post("/message", handleMessage);

module.exports = router;
