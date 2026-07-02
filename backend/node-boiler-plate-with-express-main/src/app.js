const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const contactRoutes = require("./routes/contact.routes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Correct routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use('/categories', categoryRoutes);
app.use("/contact", contactRoutes);
app.use("/chatbot", chatbotRoutes);

// 404 handler — log what was not found
app.use((req, res) => {
  console.warn(`404 NOT FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

module.exports = app;
