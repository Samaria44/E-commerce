import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./shop.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

const fixImg = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}/${img.replace(/^\/+/, "")}`;
};

export default function Product({ products: propProducts, title, label }) {
  const [list, setList] = useState(propProducts || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propProducts) {
      fetch(`${BACKEND_ORIGIN}/products`)
        .then(r => r.json())
        .then(d => setList(Array.isArray(d) ? d.map(p => ({ ...p, image: fixImg(p.image) })) : []))
        .catch(() => {});
    }
  }, [propProducts]);

  return (
    <section className="shop-section">
      <div className="shop-header">
        {label && <p className="section-label">{label}</p>}
        <h2 className="section-title">{title || "All Products"}</h2>
      </div>

      {list.length === 0 ? (
        <p className="shop-empty">No products available.</p>
      ) : (
        <div className="products-grid">
          {list.map(p => (
            <div key={p._id} className="shop-card" onClick={() => navigate(`/products/${p._id}`)}>
              <div className="shop-card-img">
                <img src={p.image} alt={p.name}
                  onError={e => { e.target.src = PLACEHOLDER; }} />
              </div>
              <div className="shop-card-info">
                <span className="shop-card-name">{p.name}</span>
                <span className="shop-card-arrow"><FiArrowRight size={16} /></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
