import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./categoryProducts.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

export default function CategoryProducts() {
  const { categoryName, subName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        // Backend only supports /products/category/:categoryName
        // Subcategory filtering is done client-side
        const res = await fetch(
          `${BACKEND_ORIGIN}/products/category/${encodeURIComponent(categoryName)}`
        );

        if (res.status === 404) {
          setProducts([]);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const formatted = data.map((p) => ({
          ...p,
          image:
            p.image && p.image.startsWith("http")
              ? p.image
              : p.image
              ? `${BACKEND_ORIGIN}/${p.image.replace(/^\/+/, "")}`
              : PLACEHOLDER,
        }));

        // Filter by subcategory client-side if subName is present
        const filtered = subName
          ? formatted.filter(
              (p) =>
                p.subCategory?.toLowerCase() === subName.toLowerCase()
            )
          : formatted;

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, subName]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
        Loading...
      </p>
    );

  if (error)
    return (
      <p style={{ textAlign: "center", padding: "60px", color: "#ef4444" }}>
        {error}
      </p>
    );

  return (
    <div className="category-page">
      <div className="category-header">
        <h2 className="category-title">
          {categoryName}
          {subName && (
            <span className="category-sub-label"> / {subName}</span>
          )}
        </h2>
        <p className="category-count">{products.length} products</p>
      </div>

      {products.length === 0 ? (
        <div className="category-empty">
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="category-products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="category-product-card"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="category-card-img-wrap">
                <img
                  src={product.image || PLACEHOLDER}
                  alt={product.name}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </div>
              <div className="category-card-info">
                <h3>{product.name}</h3>
                <p className="category-card-sub">{product.subCategory || product.category}</p>
                <p className="category-card-price">Rs {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
