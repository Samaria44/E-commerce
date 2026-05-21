import "./feature.css";
import { FaBoxOpen, FaShieldAlt, FaShippingFast } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";

const features = [
  { icon: <FaBoxOpen />, title: "100% Original", desc: "Every product is authentic and sourced directly from verified manufacturers." },
  { icon: <FaShieldAlt />, title: "Satisfaction Guarantee", desc: "Not happy? We offer hassle-free returns within 30 days of purchase." },
  { icon: <MdNewReleases />, title: "New Arrivals Daily", desc: "Fresh styles added every day so you're always ahead of the trend." },
  { icon: <FaShippingFast />, title: "Fast & Free Shipping", desc: "Free delivery on orders above Rs 2000. Express options available." },
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="features-header">
        <p className="section-label">Why Choose Us</p>
        <h2 className="section-title">Built Around<br />Your Experience</h2>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
