import { useEffect, useState } from "react";
import Product from "../components/products";
import axios from "axios";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_ORIGIN}/products/new`)
      .then(res => {
        const fixed = res.data.map(p => ({
          ...p,
          image: p.image
            ? p.image.startsWith("http") ? p.image : `${BACKEND_ORIGIN}/${p.image.replace(/^\/+/, "")}`
            : PLACEHOLDER,
        }));
        setProducts(fixed);
      })
      .catch(() => {});
  }, []);

  if (!products.length)
    return <p className="page-loading">No new arrivals yet.</p>;

  return <Product products={products} label="Just Dropped" title="New Arrivals" />;
}
