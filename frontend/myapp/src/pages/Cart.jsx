import { NavLink } from "react-router-dom";
import { useCart } from "../components/context/CartContext";
import "./addtocart.css";
import Button from "../components/Button";

const BACKEND_ORIGIN = "http://localhost:8000"; // backend URL
const PLACEHOLDER = "https://via.placeholder.com/150?text=No+Image";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.qty + 1);
  };

  const handleDecrease = (item) => {
    if (item.qty > 1) {
      updateQuantity(item.id, item.qty - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const toNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const total = cartItems.reduce((acc, item) => {
    const price = toNumber(item.price);
    const qty = toNumber(item.qty);
    return acc + price * qty;
  }, 0);

  // ✅ Helper to get full image URL
  const imgSrc = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${BACKEND_ORIGIN}${img}`;
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty">Your cart is empty!</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => {
              const price = toNumber(item.price);
              const qty = toNumber(item.qty);
              const subtotal = price * qty;

              return (
                <li key={item.id} className="cart-item">
                  <img
                    src={imgSrc(item.image)}
                    alt={item.name}
                    className="cart-img"
                  />
                  <div className="cart-details">
                    <h3>{item.name}</h3>

                    {/* Show selected size */}
                    {item.size && <p className="size">Size: {item.size}</p>}

                    <p className="price">Rs {price}</p>

                    <div className="quantity-controls">
                      <button onClick={() => handleDecrease(item)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => handleIncrease(item)}>+</button>
                    </div>

                    <p className="subtotal">Subtotal: Rs {subtotal.toFixed(2)}</p>

                    <Button label="Remove" onClick={() => removeFromCart(item.id)} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="cart-summary">
            <h2>Total: Rs {total.toFixed(2)}</h2>
            <NavLink to="/Checkout">
              <button className="checkout-btn">Proceed to Checkout</button>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}
