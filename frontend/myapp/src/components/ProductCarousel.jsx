import { useRef, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import "./product1.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

const imgSrc = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}/${img.replace(/^\/+/, "")}`;
};

export default function ProductCarousel({ title, label }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_ORIGIN}/products`)
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = dir => ref.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  if (loading) return <p className="prod-loading">Loading products…</p>;
  if (!products.length) return null;

  return (
    <section className="prod-carousel-section">
      <div className="prod-carousel-head">
        <div>
          {label && <p className="section-label">{label}</p>}
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="prod-carousel-arrows">
          <button onClick={() => scroll("left")} aria-label="Left"><FiChevronLeft size={18} /></button>
          <button onClick={() => scroll("right")} aria-label="Right"><FiChevronRight size={18} /></button>
        </div>
      </div>

      <div className="prod-carousel-track" ref={ref}>
        {products.map(p => (
          <div key={p._id} className="prod-card" onClick={() => navigate(`/products/${p._id}`)}>
            <div className="prod-card-img">
              <img src={imgSrc(p.image)} alt={p.name}
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }} />
              <button className="prod-card-cart"
                onClick={e => { e.stopPropagation(); addToCart(p); }}
                aria-label="Add to cart">
                <FiShoppingBag size={16} />
              </button>
            </div>
            <div className="prod-card-info">
              <div className="prod-card-name">{p.name}</div>
              <div className="prod-card-price">Rs {p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
