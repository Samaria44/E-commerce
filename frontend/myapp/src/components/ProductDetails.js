import { useParams } from "react-router-dom";
import "./productdetail.css";
import { useState, useEffect } from "react";
import { useCart } from "./context/CartContext";
import Button from "./Button";

export default function ProductDetails() {
  const { productid } = useParams(); // should match your route e.g. /products/:productid
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  const BACKEND_ORIGIN = "http://localhost:8000";
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BACKEND_ORIGIN}/products/${productid}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        // Fix image URL (handle both absolute and relative)
        const fixedImage = data.image
          ? data.image.startsWith("http")
            ? data.image
            : `${BACKEND_ORIGIN}/${data.image.replace(/^\/+/, "")}`
          : PLACEHOLDER;

        setProduct({ ...data, image: fixedImage });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productid]);

  //  Loading and error handling
  if (loading) return <h2>Loading product...</h2>;
  if (!product) return <h2>Product not found</h2>;

  //  Add to Cart handler
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert(" Please select a size before adding to cart!");
      return;
    }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <div className="product-detail">
      <img
        src={product.image || PLACEHOLDER}
        alt={product.name}
        onError={(e) => (e.target.src = PLACEHOLDER)}
      />

      <div className="details">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>
          <strong>Price:</strong> Rs {product.price}
        </p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>

        {/* ✅ Size Selector */}
        <div className="size-selector">
          <strong>Select Size:</strong>
          <div className="sizes">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Button label="Add to Cart" onClick={handleAddToCart} />
      </div>
    </div>
  );
}
