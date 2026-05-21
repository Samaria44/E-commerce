import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/context/CartContext";
import "./addtocart.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/100?text=No+Image";

const imgSrc = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}${img}`;
};

const FIELDS = ["name", "email", "street", "city", "state", "pincode", "phone"];

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", street: "", city: "", state: "", pincode: "", phone: "",
    paymentMethod: "cod", cardNumber: "", cardName: "", expiry: "", cvv: "",
  });

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleOrder = async e => {
    e.preventDefault();
    if (cartItems.length === 0) { alert("Your cart is empty!"); return; }

    const order = {
      customer: form.name, email: form.email, phone: form.phone,
      address: `${form.street}, ${form.city}, ${form.state} - ${form.pincode}`,
      paymentMethod: form.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment",
      products: cartItems.map(i => ({ productId: i._id, qty: i.qty, size: i.size || "-" })),
      totalAmount: total + 200,
      date: new Date().toLocaleDateString(),
    };

    try {
      const res = await fetch(`${BACKEND_ORIGIN}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error();
      setPlaced(true);
    } catch {
      alert("Failed to place order. Please try again.");
    }
  };

  if (placed) return (
    <div className="confirm-wrap">
      <div className="confirm-card">
        <div className="confirm-left">
          <h1>Order Confirmed 🎉</h1>
          <p className="confirm-note">
            Your order will be processed within 24 hours. You'll receive a confirmation once it ships.
          </p>
          <h2>Billing Address</h2>
          <p className="billing-row"><strong>Name:</strong> {form.name}</p>
          <p className="billing-row"><strong>Address:</strong> {form.street}, {form.city}, {form.state} - {form.pincode}</p>
          <p className="billing-row"><strong>Phone:</strong> {form.phone}</p>
          <p className="billing-row"><strong>Email:</strong> {form.email}</p>
          <button className="done-btn" onClick={() => { clearCart(); navigate("/"); }}>
            Continue Shopping
          </button>
        </div>
        <div className="confirm-right">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item-row">
                <img src={imgSrc(item.image)} alt={item.name} />
                <div className="summary-item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.qty} · Size: {item.size || "-"}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="confirm-totals">
            <p><span>Subtotal</span><span>Rs {total}</span></p>
            <p><span>Shipping</span><span>Rs 200</span></p>
            <div className="confirm-total-final">
              <span>Total</span><span>Rs {total + 200}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-title-row"><h1>Checkout</h1></div>

      <div className="checkout-layout">
        <form onSubmit={handleOrder}>
          <div className="checkout-form-card" style={{ marginBottom: 24 }}>
            <h2>Shipping Details</h2>
            {FIELDS.map(f => (
              <div className="form-field" key={f}>
                <label className="form-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input className="form-input" type={f === "email" ? "email" : "text"}
                  name={f} value={form[f]} onChange={onChange}
                  placeholder={`Enter your ${f}`} required />
              </div>
            ))}
          </div>

          <div className="checkout-form-card">
            <h2>Payment Method</h2>
            <div className="payment-opts">
              {[["cod", "Cash on Delivery"], ["card", "Credit / Debit Card"]].map(([val, label]) => (
                <label key={val} className={`payment-opt${form.paymentMethod === val ? " active" : ""}`}>
                  <input type="radio" name="paymentMethod" value={val}
                    checked={form.paymentMethod === val} onChange={onChange} />
                  {label}
                </label>
              ))}
            </div>

            {form.paymentMethod === "card" && (
              <div className="card-fields">
                {[["cardNumber", "Card Number", "text", "16"], ["cardName", "Cardholder Name", "text", ""]].map(([n, l, t, max]) => (
                  <div className="form-field" key={n}>
                    <label className="form-label">{l}</label>
                    <input className="form-input" type={t} name={n} value={form[n]}
                      onChange={onChange} maxLength={max || undefined} />
                  </div>
                ))}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Expiry</label>
                    <input className="form-input" type="text" name="expiry"
                      value={form.expiry} onChange={onChange} placeholder="MM/YY" maxLength="5" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">CVV</label>
                    <input className="form-input" type="password" name="cvv"
                      value={form.cvv} onChange={onChange} maxLength="3" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="place-order-btn">Place Order</button>
          </div>
        </form>

        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item-row">
                <img src={imgSrc(item.image)} alt={item.name} />
                <div className="summary-item-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size || "-"} · Qty: {item.qty}</p>
                  <p style={{ color: "var(--accent)", fontWeight: 600 }}>Rs {item.price * item.qty}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-line"><span>Subtotal</span><span>Rs {total}</span></div>
          <div className="summary-line"><span>Shipping</span><span>Rs 200</span></div>
          <div className="summary-line total"><span>Total</span><span>Rs {total + 200}</span></div>
        </div>
      </div>
    </div>
  );
}
