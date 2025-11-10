import { useEffect, useState } from "react";
import Product from "./products";

export default function Women() {
  const [womenProducts, setWomenProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_ORIGIN = "http://localhost:8000"; // ✅ Change if needed
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_ORIGIN}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // ✅ Filter women products and fix image paths
        const filtered = data
          .filter((p) => p.category?.toLowerCase() === "women")
          .map((product) => ({
            ...product,
            image: formatImageUrl(product.image),
          }));

        setWomenProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Helper function to fix image paths
  const formatImageUrl = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/")) return `${BACKEND_ORIGIN}${img}`;
    return `${BACKEND_ORIGIN}/${img}`;
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading products...</p>;
  }

  if (!womenProducts.length) {
    return <p style={{ textAlign: "center" }}>No products found.</p>;
  }

  return (
    <>
      <Product products={womenProducts} title="Women Collection" />
    </>
  );
}
