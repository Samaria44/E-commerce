import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import "./products.css";

const categories = [
  {
    title: "Men",
    image: "https://images.pexels.com/photos/19196517/pexels-photo-19196517.jpeg",
    route: "/category/Men",
  },
  {
    title: "Women",
    image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg",
    route: "/category/Women",
  },
  {
    title: "Office Collection",
    image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80",
    route: "/category/Office",
  },
  {
    title: "Summer Collection",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
    route: "/category/Summer",
  },
];

export default function CategoryCarousel() {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>Popular Categories</h2>
        <div className="carousel-arrows">
          <button onClick={() => scroll("left")} aria-label="Scroll left">
            <FiChevronLeft size={18} />
          </button>
          <button onClick={() => scroll("right")} aria-label="Scroll right">
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="carousel-track" ref={carouselRef}>
        {categories.map((cat, i) => (
          <div
            key={i}
            className="carousel-category-card"
            onClick={() => navigate(cat.route)}
          >
            <img src={cat.image} alt={cat.title} />
            <div className="overlay">
              <span>{cat.title}</span>
              <FiArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
