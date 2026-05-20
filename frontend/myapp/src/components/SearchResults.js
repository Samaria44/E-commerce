import "./search.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_ORIGIN = "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase().trim() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_ORIGIN}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

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

  const filteredProducts = products.filter((product) => {
    if (!query) return true;
    const queryWords = query.split(" ").filter(Boolean);
    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    return queryWords.some((word) => {
      const regex = new RegExp(word, "i");
      return regex.test(name) || regex.test(category) || regex.test(description);
    });
  });

  // Fixed: use _id (MongoDB field) not id
  const handleProductClick = (product) => {
    navigate(`/products/${product._id}`);
  };

  if (loading) return <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>;

  return (
    <div className="search-results">
      <h2>
        Search Results for: <span className="query-text">{query}</span>
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="no-results">No products found for "{query}".</p>
      ) : (
        <div className="search-products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="search-product-card"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image || PLACEHOLDER}
                alt={product.name}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="search-card-info">
                <h3>{product.name}</h3>
                <p className="search-card-category">{product.category}</p>
                <p className="search-card-price">Rs {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
