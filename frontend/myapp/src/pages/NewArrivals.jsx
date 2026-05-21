import { useEffect, useState } from "react";
import Product from "../components/products";
import axios from "axios";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`${BACKEND_ORIGIN}/products/new`);
        const fetched = res.data.map((p) => ({
          ...p,
          image:
            Array.isArray(p.image) && p.image.length > 0
              ? `${BACKEND_ORIGIN}${p.image[0]}`
              : p.image
              ? `${BACKEND_ORIGIN}${p.image}`
              : PLACEHOLDER,
        }));
        setProducts(fetched);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      }
    };
    fetchNewArrivals();
  }, []);

  if (!products.length)
    return <p style={{ textAlign: "center" }}>No new arrivals.</p>;

  return <Product products={products} title="New Arrivals" />;
}
