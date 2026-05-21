import { useEffect, useState } from "react";
import Product from "../components/products";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

export default function MostWanted() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_ORIGIN}/products`)
      .then(r => r.json())
      .then(data => {
        const fixed = Array.isArray(data) ? data.map(p => ({
          ...p,
          image: p.image
            ? p.image.startsWith("http") ? p.image : `${BACKEND_ORIGIN}/${p.image.replace(/^\/+/, "")}`
            : PLACEHOLDER,
        })) : [];
        // Show top 8 as "most wanted"
        setProducts(fixed.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  return <Product products={products} label="Fan Favourites" title="Most Wanted" />;
}
