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
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: Number,
    _id: false, 
    size:String,
  },
],

    totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
        "Pending",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled"
    ],
    default: "Pending"
},
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
