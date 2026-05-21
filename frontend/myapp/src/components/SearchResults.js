import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./search.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

const fixImg = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}/${img.replace(/^\/+/, "")}`;
};

export default function SearchResults() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const query = new URLSearchParams(location.search).get("query")?.toLowerCase().trim() || "";

  useEffect(() => {
    fetch(`${BACKEND_ORIGIN}/products`)
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d.map(p => ({ ...p, image: fixImg(p.image) })) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (!query) return true;
    const words = query.split(" ").filter(Boolean);
    const name  = p.name?.toLowerCase() || "";
    const cat   = p.category?.toLowerCase() || "";
    const desc  = p.description?.toLowerCase() || "";
    return words.some(w => name.includes(w) || cat.includes(w) || desc.includes(w));
  });

  if (loading) return <p className="page-loading">Searching…</p>;

  return (
    <div className="search-page">
      <h2 className="search-heading">
        Results for: <span className="search-query">"{query}"</span>
      </h2>

      {filtered.length === 0 ? (
        <p className="search-empty">No products found for "{query}".</p>
      ) : (
        <div className="search-grid">
          {filtered.map(p => (
            <div key={p._id} className="search-card"
              onClick={() => navigate(`/products/${p._id}`)}>
              <div className="search-card-img">
                <img src={p.image} alt={p.name}
                  onError={e => { e.target.src = PLACEHOLDER; }} />
              </div>
              <div className="search-card-body">
                <h3>{p.name}</h3>
                <p className="search-card-cat">{p.category}</p>
                <p className="search-card-price">Rs {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
