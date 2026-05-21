import { NavLink } from "react-router-dom";
import { useCart } from "../components/context/CartContext";
import "./addtocart.css";
import Button from "../components/Button";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/150?text=No+Image";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  const handleIncrease = (item) => updateQuantity(item.key, item.qty + 1);
  const handleDecrease = (item) => {
    if (item.qty > 1) updateQuantity(item.key, item.qty - 1);
    else removeFromCart(item.key);
  };

  const imgSrc = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http")) return img;
    return `${BACKEND_ORIGIN}${img}`;
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty">Your cart is empty!</p>
      ) : (
        <>
       <table className="cart-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Details</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Subtotal</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {cartItems.map((item) => (
      <tr key={item.key}>
        <td>
          <img src={imgSrc(item.image)} alt={item.name} className="cart-img" />
        </td>
        <td>
          {/* <h1>{item.name}</h1> */}
          {item.size && <p className="size">Size: {item.size}</p>}
          {item.color && <p className="color">Color: {item.color}</p>}
          {item.subcategory && <p className="subcategory">Sub: {item.subcategory}</p>}
        </td>
        <td>Rs {item.price}</td>
        <td>
          <div className="quantity-controls">
            <button onClick={() => handleDecrease(item)}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => handleIncrease(item)}>+</button>
          </div>
        </td>
        <td>Rs {(item.price * item.qty).toFixed(2)}</td>
        <td>
          <Button label="Remove" onClick={() => removeFromCart(item.key)} />
        </td>
      </tr>
    ))}
  </tbody>
</table>
          <div className="cart-summary">
            <h2>Total: Rs {totalPrice.toFixed(2)}</h2>
            <NavLink to="/Checkout">
              <button className="checkout-btn">Checkout</button>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}
