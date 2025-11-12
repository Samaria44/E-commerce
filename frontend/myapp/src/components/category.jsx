import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./categoryProducts.css";

export default function CategoryProducts() {
  const { categoryName, subName } = useParams(); // e.g. /category/summer or /category/summer/sub/office
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_ORIGIN = "http://localhost:8000";
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${BACKEND_ORIGIN}/products/category/${categoryName}`;
        if (subName) url += `/sub/${subName}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products by category");
        const data = await res.json();

        const formatted = data.map((p) => ({
          ...p,
          image:
            p.image && (p.image.startsWith("http") || p.image.startsWith("https"))
              ? p.image
              : `${BACKEND_ORIGIN}/${p.image?.replace(/^\/+/, "")}`,
        }));

        setProducts(formatted);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, subName]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="category-page">
      <h2 className="category-title">
        {categoryName.toUpperCase()} {subName ? `→ ${subName}` : ""}
      </h2>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="category-products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="category-product-card"
              onClick={() => handleProductClick(product._id)}
            >
              <img
                src={product.image || PLACEHOLDER}
                alt={product.name}
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />
              <h3>{product.name}</h3>
              <p>{product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
