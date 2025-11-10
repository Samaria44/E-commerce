import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  //  Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add product to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const productPrice = Number(product.price) || 0;

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: Number(item.qty) + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            price: productPrice,
            qty: 1,
          },
        ];
      }
    });
  };

  // ❌ Remove product
  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  // 🔄 Update quantity safely
  const updateQuantity = (id, newQty) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Number(newQty) || 1) } // Prevent invalid qty
          : item
      )
    );

  // 🧹 Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // 🧮 Count total items
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0
  );

  // 💰 Total price helper (you can reuse in other places if needed)
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

  console.log(" Cart Items:", cartItems);
  console.log(" Total Price:", totalPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice, // ✅ optional — makes it easier to access in checkout/cart page
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for using cart
export const useCart = () => useContext(CartContext);
