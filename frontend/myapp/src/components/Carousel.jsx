import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Carousel.css";

export default function Slidebar() {
  const slides = [
    {
      img: "https://images.pexels.com/photos/7679455/pexels-photo-7679455.jpeg?auto=compress&cs=tinysrgb&w=1600",
      text: "Dress up in the most beautiful outfits with our new season Collection",
    },
    {
      img: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=1600",
      text: "Unleash your inner style icon with our fresh arrivals",
    },
    {
      img: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1600",
      text: "Elevate your fashion game with trendsetting designs",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="carousel-containerr">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? "active" : ""}`}
        >
          <img src={slide.img} alt={`Slide ${index + 1}`} />
          <div className="slide-text">
            {slide.text}
            <br />
            <Link to="/Product" className="shop-now-link">
              <button id="btnn">Shop Now</button>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      <div className="navigation">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
