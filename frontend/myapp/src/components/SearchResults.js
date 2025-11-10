// src/pages/SearchResults.js
import "./search.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // fetched from backend
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase().trim() || "";

  const BACKEND_ORIGIN = "http://localhost:8000"; // your backend base URL
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  // ✅ Fetch all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_ORIGIN}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // ✅ Fix image paths (in case they are relative)
        const fixedProducts = data.map((product) => ({
          ...product,
          image: product.image?.startsWith("http")
            ? product.image
            : `${BACKEND_ORIGIN}/${product.image?.replace(/^\/+/, "")}`,
        }));

        setProducts(fixedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Improved search filtering logic
  const filteredProducts = products.filter((product) => {
    const queryWords = query.split(" ").filter(Boolean);
    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const color = product.color?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    return queryWords.some((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return (
        regex.test(name) ||
        regex.test(category) ||
        regex.test(color) ||
        regex.test(description)
      );
    });
  });

  // ✅ Handle product click → navigate to detail page
  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`); // using product ID from backend
  };

  if (loading) return <h2>Loading products...</h2>;

  return (
    <div className="search-results">
      <h2>
        Search Results for: <span className="query-text">{query}</span>
      </h2>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="search-products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="search-product-card"
              onClick={() => handleProductClick(product)}
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
