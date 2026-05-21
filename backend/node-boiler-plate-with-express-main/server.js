require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB().catch((error) => {
  console.error("MongoDB connection error:", error.message);
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
