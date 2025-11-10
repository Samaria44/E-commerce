import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./products.css";

export default function CategoryCarousel() {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const scrollAmount = 350;
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const categories = [
    {
      title: "Shop Men",
      image:
        "https://images.pexels.com/photos/19196517/pexels-photo-19196517.jpeg",
      url: "/Men",
    },
    {
      title: "Shop Women",
      image:
        "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg",
      url: "/Women",
    },
    {
      title: "Shop Office",
      image:
        "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80",
      url: "/Office",
    },
    {
      title: "Summer Collection",
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
      url: "/summer",
    },
  ];

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>Popular Categories</h2>
        <div className="carousel-arrows">
          <button onClick={() => scroll("left")}>❮</button>
          <button onClick={() => scroll("right")}>❯</button>
        </div>
      </div>

      <div className="carousel-track" ref={carouselRef}>
        {categories.map((cat, i) => (
          <div
            key={i}
            className="carousel-category-card"
            onClick={() => navigate(cat.url)}
          >
            <img src={cat.image} alt={cat.title} />
            <div className="overlay">
              <span>{cat.title}</span>
               <span className="arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
