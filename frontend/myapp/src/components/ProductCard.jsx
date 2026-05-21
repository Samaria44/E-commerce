import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./shop.css";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="shop-card">
      <div className="shop-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="shop-card-info">
        <span className="shop-card-name">{product.name}</span>
        <span className="shop-card-arrow"><FiArrowRight size={16} /></span>
      </div>
    </Link>
  );
}
