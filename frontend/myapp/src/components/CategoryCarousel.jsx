import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import "./products.css";

const categories = [
  { title: "Men", image: "https://images.pexels.com/photos/19196517/pexels-photo-19196517.jpeg", route: "/category/men" },
  { title: "Women", image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg", route: "/category/Women" },
  { title: "Kids", image: "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg", route: "/category/kids" },
  { title: "New Arrivals", image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg", route: "/products/new" },
];

export default function CategoryCarousel() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const scroll = dir => ref.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });

  return (
    <section className="cat-carousel-section">
      <div className="cat-carousel-head">
        <div>
          <p className="section-label">Browse</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="cat-carousel-arrows">
          <button onClick={() => scroll("left")} aria-label="Left"><FiChevronLeft size={18} /></button>
          <button onClick={() => scroll("right")} aria-label="Right"><FiChevronRight size={18} /></button>
        </div>
      </div>

      <div className="cat-carousel-track" ref={ref}>
        {categories.map((c, i) => (
          <div key={i} className="cat-card" onClick={() => navigate(c.route)}>
            <img src={c.image} alt={c.title} />
            <div className="cat-card-overlay">
              <div className="cat-card-title">{c.title}</div>
              <div className="cat-card-cta">Shop Now <FiArrowRight size={13} /></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
