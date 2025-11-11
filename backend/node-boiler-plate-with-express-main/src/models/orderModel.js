// models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    paymentMethod: { type: String },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product", // 👈 must match model name in productModel.js
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
