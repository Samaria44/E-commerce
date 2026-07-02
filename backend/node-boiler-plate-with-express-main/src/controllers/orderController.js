//orderController

// orderController.js
const Order = require("../models/orderModel");
const Product = require("../models/productModel"); 
const sendWhatsApp = require("../services/whatsappService");


// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "products.product"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Add new order
exports.addOrder = async (req, res) => {
  try {
    const {
      customer,
      email,
      phone,
      address,
      paymentMethod,
      products,
      totalAmount,
      date,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in the order" });
    }

    // Format products to include only necessary fields
    const formattedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId); // frontend sends productId
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        return {
          product: product._id, // store only reference
          qty: item.qty,
          size: item.size || "-",
        };
      })
    );

    const newOrder = new Order({
      customer,
      email,
      phone,
      address,
      paymentMethod,
      products: formattedProducts,
      totalAmount,
      date,
    });

    const savedOrder = await newOrder.save();
    // Send WhatsApp Confirmation
try {
  const message = `🛍️ ZAVARO

Hello ${customer},

✅ Your order has been placed successfully!

💰 Total: Rs.${totalAmount}

📍 Address:
${address}

🚚 We'll contact you soon.

Thank you for shopping with ZAVARO ❤️`;

  await sendWhatsApp(phone.replace("+", ""), message);

  console.log("WhatsApp message sent successfully.");
} catch (err) {
  console.error("WhatsApp Error:", err.message);
  // Don't stop order saving if WhatsApp fails
}

    // Populate product info (select only required fields)
    const populatedOrder = await savedOrder.populate(
      "products.product",
      "name price image category subCategory size"
    );

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Update order (status change)
exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated successfully", order: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
