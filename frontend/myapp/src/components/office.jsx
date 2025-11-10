import { useEffect, useState } from "react";
import Product from "./products";

export default function Office() {
  const [officeProducts, setOfficeProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_ORIGIN = "http://localhost:8000"; 
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_ORIGIN}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // ✅ Filter products by subCategory (camelCase)
        const filtered = data
          .filter((p) => p.subCategory?.toLowerCase() === "office")
          .map((product) => ({
            ...product,
            image: formatImageUrl(product.image),
          }));

        setOfficeProducts(filtered);
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

  if (!officeProducts.length) {
    return <p style={{ textAlign: "center" }}>No products found.</p>;
  }

  return (
    <>
      <Product products={officeProducts} title="Office Collection" />
    </>
  );
}
