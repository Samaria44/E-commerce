import { useEffect, useState } from "react";
import Product from "../components/products"; // your product card component
import axios from "axios";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const BACKEND_ORIGIN = "http://localhost:8000";

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`${BACKEND_ORIGIN}/products/new`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNewArrivals();
  }, []);

  if (!products.length) return <p style={{ textAlign: "center" }}>No new arrivals.</p>;

  return <Product products={products} title="New Arrivals" />;
}
