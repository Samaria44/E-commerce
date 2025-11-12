import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add product to cart
  const addToCart = (product) => {
    const key = `${product.id}-${product.size || ""}-${product.color || ""}-${product.subcategory || ""}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);

      if (existing) {
        // If same variation exists, just increase qty
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // Add new product with unique key
        return [
          ...prev,
          {
            ...product,
            key,
            qty: 1,
            price: Number(product.price) || 0,
          },
        ];
      }
    });
  };

  // ❌ Remove product
  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  // 🔄 Update quantity
  const updateQuantity = (key, qty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // 🧮 Total price & count
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export const useCart = () => useContext(CartContext);
