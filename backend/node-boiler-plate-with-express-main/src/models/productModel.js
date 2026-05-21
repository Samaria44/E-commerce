const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    description: String,
    category:    { type: String, required: true },
    subCategory: String,
    size:        String,
    // Multiple images stored as array of paths
    images:      { type: [String], default: [] },
    // Keep legacy single-image field for backward compatibility
    image:       String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
