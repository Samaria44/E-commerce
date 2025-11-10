import { useEffect, useState } from "react";
import Custom from "../components/feature";
import Slidebar from "../components/Carousel";
import ProductCarousel from "../components/ProductCarousel.jsx";
import Last from "../components/banner";
import CategoryCarousel from "../components/CategoryCarousel.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_ORIGIN = "http://localhost:8000";
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_ORIGIN}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // ✅ Fix image paths
        const fixedData = data.map((product) => ({
          ...product,
          image: formatImageUrl(product.image),
        }));

        setProducts(fixedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Helper to fix relative image URLs
  const formatImageUrl = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${BACKEND_ORIGIN}${img}`;
    return `${BACKEND_ORIGIN}/${img}`;
  };

  return (
    <>
      <Slidebar />
      <Custom />
      <CategoryCarousel />

      {/* ✅ Show loading / carousel */}
      <div>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : products.length > 0 ? (
          <ProductCarousel
            title="Popular Products of This Week"
            products={products}
          />
        ) : (
          <p style={{ textAlign: "center" }}>No products found.</p>
        )}
      </div>

      <Last />
    </>
  );
}
