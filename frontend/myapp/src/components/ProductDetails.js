import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiShoppingBag, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "./context/CartContext";
import "./productdetail.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

const fixImg = img => {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}/${img.replace(/^\/+/, "")}`;
};

export default function ProductDetails() {
  const { productid } = useParams();
  const navigate       = useNavigate();
  const { addToCart }  = useCart();

  const [product, setProduct]           = useState(null);
  const [related, setRelated]           = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading]           = useState(true);
  const [added, setAdded]               = useState(false);
  const [activeImg, setActiveImg]       = useState(0);

  // Fetch the main product
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setRelated([]);
    setSelectedSize("");
    setActiveImg(0);

    fetch(`${BACKEND_ORIGIN}/products/${productid}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        // Normalise images array
        const imgs = data.images?.length
          ? data.images.map(fixImg)
          : data.image ? [fixImg(data.image)] : [PLACEHOLDER];
        setProduct({ ...data, images: imgs, image: imgs[0] });
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productid]);

  // Fetch related products once we know the category
  useEffect(() => {
    if (!product?.category) return;
    fetch(`${BACKEND_ORIGIN}/products/category/${encodeURIComponent(product.category)}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const others = data
          .filter(p => p._id !== productid)
          .slice(0, 4)
          .map(p => ({ ...p, image: fixImg(p.image) }));
        setRelated(others);
      })
      .catch(() => setRelated([]));
  }, [product, productid]);

  if (loading) return <p className="detail-loading">Loading product…</p>;
  if (!product) return <p className="detail-error">Product not found.</p>;

  const images = product.images || [product.image || PLACEHOLDER];

  const handleAdd = () => {
    if (!selectedSize) { alert("Please select a size first."); return; }
    addToCart({ ...product, size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % images.length);

  return (
    <div className="detail-page">

      {/* ── Main product ── */}
      <div className="detail-grid">
        {/* Image gallery */}
        <div className="detail-gallery">
          {/* Main image */}
          <div className="detail-img-wrap">
            <img src={images[activeImg]} alt={product.name}
              onError={e => { e.target.src = PLACEHOLDER; }} />
            {/* Prev / Next arrows — only show if multiple images */}
            {images.length > 1 && (
              <>
                <button className="gallery-arrow gallery-arrow-left" onClick={prevImg} aria-label="Previous">
                  <FiChevronLeft size={20} />
                </button>
                <button className="gallery-arrow gallery-arrow-right" onClick={nextImg} aria-label="Next">
                  <FiChevronRight size={20} />
                </button>
                {/* Dot indicators */}
                <div className="gallery-dots">
                  {images.map((_, i) => (
                    <button key={i} className={`gallery-dot${i === activeImg ? " active" : ""}`}
                      onClick={() => setActiveImg(i)} aria-label={`Image ${i + 1}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="detail-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`detail-thumb${i === activeImg ? " active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" onError={e => { e.target.src = PLACEHOLDER; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          {product.category && (
            <span className="detail-category">{product.category}</span>
          )}
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-price">Rs {product.price}</div>
          {product.description && (
            <p className="detail-desc">{product.description}</p>
          )}

          <div className="detail-size-label">Select Size</div>
          <div className="detail-sizes">
            {["XS", "S", "M", "L", "XL", "XXL"].map(s => (
              <button key={s}
                className={`size-btn${selectedSize === s ? " selected" : ""}`}
                onClick={() => setSelectedSize(s)}>{s}
              </button>
            ))}
          </div>

          <button className="detail-add-btn" onClick={handleAdd}>
            <FiShoppingBag size={18} />
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div className="related-section">
          <div className="related-header">
            <div>
              <p className="related-label">You May Also Like</p>
              <h2 className="related-title">Related Products</h2>
            </div>
            <button
              className="related-view-all"
              onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}
            >
              View All <FiArrowRight size={14} />
            </button>
          </div>

          <div className="related-grid">
            {related.map(p => (
              <div
                key={p._id}
                className="related-card"
                onClick={() => navigate(`/products/${p._id}`)}
              >
                <div className="related-card-img">
                  <img src={p.image} alt={p.name}
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                  <div className="related-card-overlay">
                    <button
                      className="related-cart-btn"
                      onClick={e => { e.stopPropagation(); addToCart(p); }}
                      aria-label="Add to cart"
                    >
                      <FiShoppingBag size={15} />
                    </button>
                  </div>
                </div>
                <div className="related-card-info">
                  <p className="related-card-name">{p.name}</p>
                  <p className="related-card-price">Rs {p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
