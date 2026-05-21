import { useRef, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import "./product1.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

export default function ProductCarousel({ title }) {
  const scrollRef = useRef();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_ORIGIN}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Scroll handler
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;
    current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  // ✅ Navigate to product details
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // ✅ Add to Cart (stop navigation)
  const handleCartClick = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  // ✅ Fix image URL
  const imgSrc = (img) => {
    if (!img) return PLACEHOLDER;
    if (typeof img !== "string") return PLACEHOLDER;
    const trimmed = img.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("/")) {
      return `${BACKEND_ORIGIN}${trimmed}`;
    }
    return `${BACKEND_ORIGIN}/${trimmed}`;
  };

  if (loading) return <h3 className="loading-text">Loading products...</h3>;
  if (!products.length) return <p>No products available</p>;

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>{title}</h2>
        <div className="carousel-arrows">
          <button onClick={() => scroll("left")}><FaArrowLeft /></button>
          <button onClick={() => scroll("right")}><FaArrowRight /></button>
        </div>
      </div>

      <div className="carousel-track" ref={scrollRef}>
        {products.map((product) => (
          <div
            className="carousel-card"
            key={product._id} 
            onClick={() => handleCardClick(product._id)} 
          >
            <img
              src={imgSrc(product.image)}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
            <div className="carousel-card-info">
              <h3>{product.name}</h3>
              <div className="product-bottom">
                <div className="price-section">
                  <span className="price">Rs {product.price}</span>
                </div>
                <button
                  className="cart-btn"
                  onClick={(e) => handleCartClick(e, product)}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
