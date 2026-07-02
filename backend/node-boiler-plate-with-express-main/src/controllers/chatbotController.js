/**
 * Chatbot Controller — Webhook handler
 *
 * Flow:
 *  1. Receive { message, sessionId? } from frontend
 *  2. Try to get a reply from an external AI webhook (optional, set CHATBOT_WEBHOOK_URL in .env)
 *  3. Fall back to local rule-based engine if the webhook is not configured or fails
 *  4. Return { reply, source }
 */

const axios = require("axios");

// ── Shop info (used in rule-based replies) ────────
const SHOP = {
  phone: process.env.SHOP_PHONE || "+92 317 803 9368",
  email: process.env.SHOP_EMAIL || "ask@wearzane.com",
  hours: process.env.SHOP_HOURS || "Mon–Fri, 10am–5pm",
};

// ── External AI webhook (optional) ───────────────
// Set CHATBOT_WEBHOOK_URL in your .env to forward messages to any
// AI service (Dialogflow, OpenAI, Rasa, etc.)
// Expected: POST { message, sessionId } → { reply: "..." }
const WEBHOOK_URL    = process.env.CHATBOT_WEBHOOK_URL || "";
const WEBHOOK_SECRET = process.env.CHATBOT_WEBHOOK_SECRET || "";

// ── Rule-based fallback engine ────────────────────
const getRuleBasedReply = (msg) => {
  const m = msg.toLowerCase().trim();

  if (/^(hi|hello|hey|hola|salam|assalam|good (morning|afternoon|evening))/.test(m))
    return `👋 Hi there! Welcome to ShopZone. I'm here to help you. What can I do for you today?`;

  if (/track|order status|where.*order|my order/.test(m))
    return `📦 To track your order please email us at **${SHOP.email}** with your Order ID, or call **${SHOP.phone}** during business hours (${SHOP.hours}).`;

  if (/return|refund|exchange|replace/.test(m))
    return `🔄 We accept returns within **7 days** of delivery. The item must be unused and in its original packaging. To start a return, contact us at **${SHOP.email}**.`;

  if (/ship|deliver|delivery time|how long|when.*arrive/.test(m))
    return `🚚 Standard delivery takes **3–5 business days** across Pakistan. Express delivery (1–2 days) is available in major cities for Rs 300 extra.`;

  if (/pay|payment|cod|card|online payment|bank/.test(m))
    return `💳 We accept:\n• Cash on Delivery (COD)\n• Debit / Credit Cards\n• Bank Transfer\n\nAll card payments are processed securely.`;

  if (/size|sizing|fit|measurement|chart/.test(m))
    return `📏 Our clothing comes in XS, S, M, L, XL, and XXL. Each product page has a detailed **size chart**. We recommend measuring yourself and comparing with the chart before ordering.`;

  if (/discount|offer|sale|promo|coupon|voucher/.test(m))
    return `🏷️ Subscribe to our newsletter (bottom of the homepage) to get **exclusive deals** and early sale access! We also run seasonal sales — check back regularly.`;

  if (/cancel|cancell/.test(m))
    return `❌ Orders can be cancelled within **24 hours** of placing them. After that, please wait for delivery and then initiate a return.`;

  if (/price|cost|how much|charges/.test(m))
    return `💰 Prices vary by product. Browse our shop to find something in your budget — we have styles starting from Rs 500!`;

  if (/contact|support|agent|human|staff|talk to someone/.test(m))
    return `📞 You can reach our support team:\n📧 **${SHOP.email}**\n📱 **${SHOP.phone}**\n🕐 ${SHOP.hours}`;

  if (/product|stock|available|in stock/.test(m))
    return `🛍️ Browse our full catalogue at the **Shop** page. If a product is out of stock, you'll see it marked on the listing. Contact us to request a restock!`;

  if (/thank|thanks|thankyou|thx|great|awesome|perfect/.test(m))
    return `😊 You're very welcome! Is there anything else I can help you with?`;

  if (/bye|goodbye|ok done|no thanks|that.*all/.test(m))
    return `👋 Goodbye! Have a great day. Feel free to come back anytime — we're always here to help!`;

  if (/how are you|are you (a )?bot|who are you|what are you/.test(m))
    return `🤖 I'm the ShopZone virtual assistant! I'm here 24/7 to answer your questions about orders, shipping, returns, and more. How can I help?`;

  // Default fallback
  return `🤔 I'm not sure about that one. For detailed assistance, please contact our team:\n📧 **${SHOP.email}**\n📱 **${SHOP.phone}**\n🕐 ${SHOP.hours}`;
};

// ── Main handler ──────────────────────────────────
exports.handleMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const cleanMsg = message.trim().slice(0, 500); // sanitise length

    // ── Try external AI webhook first ──
    if (WEBHOOK_URL) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (WEBHOOK_SECRET) headers["x-webhook-secret"] = WEBHOOK_SECRET;

        const response = await axios.post(
          WEBHOOK_URL,
          { message: cleanMsg, sessionId: sessionId || "anon" },
          { headers, timeout: 5000 }
        );

        const aiReply = response.data?.reply || response.data?.text || response.data?.message;
        if (aiReply) {
          return res.json({ reply: aiReply, source: "webhook" });
        }
      } catch (webhookErr) {
        // Webhook failed — fall through to rule-based
        console.warn("Chatbot webhook error, using fallback:", webhookErr.message);
      }
    }

    // ── Rule-based fallback ──
    const reply = getRuleBasedReply(cleanMsg);
    return res.json({ reply, source: "local" });

  } catch (err) {
    console.error("Chatbot controller error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
