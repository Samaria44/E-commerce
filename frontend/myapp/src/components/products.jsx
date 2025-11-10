import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./shop.css";

export default function Product({ products, title }) {
  const [isVisible, setIsVisible] = useState(false);
  const [productList, setProductList] = useState(products || []);
  const navigate = useNavigate();

  const BACKEND_ORIGIN = "http://localhost:8000";
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  // ✅ Fetch products from backend if not passed as props
  useEffect(() => {
    const fetchData = async () => {
      if (!products) {
        try {
          const response = await fetch(`${BACKEND_ORIGIN}/products`);
          if (!response.ok) throw new Error("Failed to fetch products");
          const data = await response.json();

          // ✅ Fix image URLs and store
          const formatted = data.map((product) => ({
            ...product,
            image: formatImageUrl(product.image),
          }));

          setProductList(formatted);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchData();
  }, [products]);

  // ✅ Fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Helper: Fix backend image URL
  const formatImageUrl = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_ORIGIN}${img}`;
    return `${BACKEND_ORIGIN}/${img}`;
  };

  // ✅ Navigate to product detail page
  const handleProductClick = (_id) => {
    navigate(`/products/${_id}`);
  };

  return (
    <div className={`container ${isVisible ? "visible" : "hidden"}`}>
      <div className="popular-products">
        <div className="page-header">
          <h2 className="page-title">{title}</h2>
        </div>

        <div className="products-container">
          {productList && productList.length > 0 ? (
            productList.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-footer">
                  <span className="product-name">{product.name}</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
