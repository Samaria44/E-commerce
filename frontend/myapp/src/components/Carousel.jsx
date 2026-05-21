import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import "./Carousel.css";

const slides = [
  {
    img: "https://images.pexels.com/photos/7679455/pexels-photo-7679455.jpeg?auto=compress&cs=tinysrgb&w=1600",
    eyebrow: "New Season 2025",
    title: <>Dress Up in<br /><em>Beautiful</em> Style</>,
    sub: "Discover our latest collection — premium fashion crafted for those who dare to stand out.",
  },
  {
    img: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=1600",
    eyebrow: "Fresh Arrivals",
    title: <>Unleash Your<br /><em>Inner Icon</em></>,
    sub: "New arrivals every week. Be the first to wear what's trending this season.",
  },
  {
    img: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1600",
    eyebrow: "Premium Collection",
    title: <>Elevate Your<br /><em>Fashion Game</em></>,
    sub: "Trendsetting designs that blend comfort with luxury. Your style, your rules.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero">
      {slides.map((s, i) => (
        <div key={i} className={`hero-slide${i === current ? " active" : ""}`}>
          <img src={s.img} alt="" />
        </div>
      ))}

      <div className="hero-content">
        <div className="hero-eyebrow">
          <FiShoppingBag size={11} />
          {slides[current].eyebrow}
        </div>
        <h1 className="hero-title">{slides[current].title}</h1>
        <p className="hero-sub">{slides[current].sub}</p>
        <div className="hero-actions">
          <Link to="/product">
            <button className="hero-btn-primary">
              Shop Now <FiArrowRight size={16} />
            </button>
          </Link>
          <Link to="/products/new">
            <button className="hero-btn-ghost">New Arrivals</button>
          </Link>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-num">500+</div>
          <div className="hero-stat-label">Products</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">10k+</div>
          <div className="hero-stat-label">Customers</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">4.9★</div>
          <div className="hero-stat-label">Rating</div>
        </div>
      </div>
    </section>
  );
}
