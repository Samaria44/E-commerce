import React, { useState } from "react";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";
import "./addtocart.css";
import Button from "../components/Button";

const BACKEND_ORIGIN = "http://localhost:8000"; // Backend base URL
const PLACEHOLDER = "https://via.placeholder.com/100?text=No+Image";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    paymentMethod: "cod",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleOrder = async (e) => {
    e.preventDefault();

    const { name, email, street, city, state, pincode, phone, paymentMethod } = orderDetails;

    if (!name || !email || !street || !city || !state || !pincode || !phone) {
      alert("Please fill all required fields!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // ✅ Prepare Order Data
    const newOrder = {
      customer: name,
      email,
      phone,
      address: `${street}, ${city}, ${state} - ${pincode}`,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment",
      products: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        size: item.size || "-",
        image: item.image, // keep raw path
      })),
      totalAmount: total + 200,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    try {
      const res = await fetch(`${BACKEND_ORIGIN}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) throw new Error("Failed to save order");
      await res.json();

      setOrderPlaced(true);
    } catch (error) {
      console.error("❌ Error saving order:", error);
      alert("Failed to place order. Please try again!");
    }
  };

  const handleContinue = () => {
    clearCart();
    navigate("/");
  };

  // ✅ Helper for correct image path
  const imgSrc = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${BACKEND_ORIGIN}${img}`;
  };

  // ✅ After order placed
  if (orderPlaced) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          {/* Left Section */}
          <div className="confirmation-left">
            <h1>Thank you for your purchase!</h1>
            <p className="order-note">
              Your order will be processed within 24 hours. You’ll receive an email once it ships.
            </p>

            <h2>Billing Address</h2>
            <div className="billing-info">
              <p><strong>Name:</strong> {orderDetails.name}</p>
              <p>
                <strong>Address:</strong> {`${orderDetails.street}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`}
              </p>
              <p><strong>Phone:</strong> {orderDetails.phone}</p>
              <p><strong>Email:</strong> {orderDetails.email}</p>
            </div>

            <Button label="Done" onClick={handleContinue} />
          </div>

          {/* Right Section */}
          <div className="confirmation-right">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <div className="summary-meta">
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Order Number:</strong> 024-{Math.floor(Math.random() * 100000000)}</p>
                <p>
                  <strong>Payment:</strong> {orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment"}
                </p>
              </div>
            </div>

            <div className="summary-products">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={imgSrc(item.image)} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.qty} | Size: {item.size ?? "-"}</p>
                  </div>
                  <span className="item-price">Rs {item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <p><span>Subtotal</span><span>Rs {total}</span></p>
              <p><span>Shipping</span><span>Rs 200</span></p>
              <hr />
              <p className="order-total">
                <strong>Total</strong>
                <strong>Rs {total + 200}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Checkout form
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        {/* Left: Form */}
        <form className="checkout-form" onSubmit={handleOrder}>
          <h2>Shipping Details</h2>

          {["name", "email", "street", "city", "state", "pincode", "phone"].map((field) => (
            <React.Fragment key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={orderDetails[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
              />
            </React.Fragment>
          ))}

          <h2>Payment Method</h2>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={orderDetails.paymentMethod === "cod"}
                onChange={handleChange}
              /> Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={orderDetails.paymentMethod === "card"}
                onChange={handleChange}
              /> Credit / Debit Card
            </label>
          </div>

          {orderDetails.paymentMethod === "card" && (
            <div className="card-details">
              <label>Card Number</label>
              <input type="text" name="cardNumber" value={orderDetails.cardNumber} onChange={handleChange} maxLength="16" />
              <label>Cardholder Name</label>
              <input type="text" name="cardName" value={orderDetails.cardName} onChange={handleChange} />
              <div className="card-row">
                <div>
                  <label>Expiry</label>
                  <input type="text" name="expiry" value={orderDetails.expiry} onChange={handleChange} placeholder="MM/YY" maxLength="5" />
                </div>
                <div>
                  <label>CVV</label>
                  <input type="password" name="cvv" value={orderDetails.cvv} onChange={handleChange} maxLength="3" />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="place-order-btn">Place Order</button>
        </form>

        {/* Right: Summary */}
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-summary-box">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-product">
                <img src={imgSrc(item.image)} alt={item.name} />
                <div className="summary-product-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size || "-"}</p>
                  <p>Qty: {item.qty}</p>
                  <p>Price: Rs {item.price * item.qty}</p>
                </div>
              </div>
            ))}

            <div className="summary-item">
              <span>Subtotal</span>
              <span>Rs {total}</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>Rs 200</span>
            </div>
            <div className="summary-item total">
              <strong>Total</strong>
              <strong>Rs {total + 200}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
