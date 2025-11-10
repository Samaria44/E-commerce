import { Link } from "react-router-dom";
import "./shop.css";
export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        loading="lazy"
      />
      <div className="product-footer">
        <span className="product-name">{product.name}</span>
        {/* <span className="product-price">Rs {product.price}</span> */}
        <span className="arrow">→</span>
      </div>
    </Link>
  );
}
