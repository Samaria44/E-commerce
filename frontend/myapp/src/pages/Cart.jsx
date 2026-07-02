import { NavLink } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../components/context/CartContext";
import "./addtocart.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/150?text=No+Image";

const imgSrc = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  // Handle both /uploads/file and uploads/file
  const clean = img.startsWith("/") ? img : `/${img}`;
  return `${BACKEND_ORIGIN}${clean}`;
};

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  const inc = item => updateQuantity(item.key, item.qty + 1);
  const dec = item => {
    if (item.qty > 1) updateQuantity(item.key, item.qty - 1);
    else removeFromCart(item.key);
  };

  return (
    <div className="page-container">
      <div className="page-title-row">
        <h1>Your Cart</h1>
        <p>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <FiShoppingBag size={48} style={{ color: "var(--muted)" }} />
          <p>Your cart is empty.</p>
          <NavLink to="/product">
            <button className="cart-checkout-btn">Start Shopping</button>
          </NavLink>
        </div>
      ) : (
        <>
          <div className="cart-table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Details</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.key}>
                    <td><img src={imgSrc(item.image)} alt={item.name} className="cart-img" /></td>
                    <td>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` · Color: ${item.color}`}
                      </div>
                    </td>
                    <td>Rs {item.price}</td>
                    <td>
                      <div className="qty-ctrl">
                        <button onClick={() => dec(item)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => inc(item)}>+</button>
                      </div>
                    </td>
                    <td style={{ color: "var(--white)", fontWeight: 600 }}>
                      Rs {(item.price * item.qty).toFixed(0)}
                    </td>
                    <td>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.key)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary-bar">
            <div className="cart-total-text">
              Total: <span>Rs {totalPrice.toFixed(0)}</span>
            </div>
            <NavLink to="/Checkout">
              <button className="cart-checkout-btn">Proceed to Checkout</button>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}
