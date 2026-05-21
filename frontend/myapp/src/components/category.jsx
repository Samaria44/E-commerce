import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./categoryProducts.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

const fixImg = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}/${img.replace(/^\/+/, "")}`;
};

export default function CategoryProducts() {
  const { categoryName, subName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${BACKEND_ORIGIN}/products/category/${encodeURIComponent(categoryName)}`)
      .then(r => {
        if (r.status === 404) return [];
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => {
        const formatted = data.map(p => ({ ...p, image: fixImg(p.image) }));
        const filtered = subName
          ? formatted.filter(p => p.subCategory?.toLowerCase() === subName.toLowerCase())
          : formatted;
        setProducts(filtered);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, [categoryName, subName]);

  if (loading) return <p className="page-loading">Loading…</p>;
  if (error)   return <p className="page-error">{error}</p>;

  return (
    <div className="category-page">
      <div className="category-header">
        <h1 className="category-title">
          {categoryName}
          {subName && <span className="category-sub-label"> / {subName}</span>}
        </h1>
        <span className="category-count">{products.length} products</span>
      </div>

      {products.length === 0 ? (
        <div className="category-empty">No products found in this category.</div>
      ) : (
        <div className="category-products-grid">
          {products.map(p => (
            <div key={p._id} className="category-product-card"
              onClick={() => navigate(`/products/${p._id}`)}>
              <div className="category-card-img-wrap">
                <img src={p.image} alt={p.name}
                  onError={e => { e.target.src = PLACEHOLDER; }} />
              </div>
              <div className="category-card-info">
                <h3>{p.name}</h3>
                <p className="category-card-sub">{p.subCategory || p.category}</p>
                <p className="category-card-price">Rs {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
