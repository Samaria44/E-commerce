const axios = require("axios");

const sendWhatsApp = async (phone, message) => {
  try {
    const response = await axios.post(
      `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`,
      {
        token: process.env.ULTRAMSG_TOKEN,
        to: phone,
        body: message,
      }
    );

    console.log("✅ WhatsApp Sent");
    console.log(response.data);

  } catch (error) {
    console.log("❌ WhatsApp Error");
    console.log(error.response?.data || error.message);
  }
};

module.exports = sendWhatsApp;