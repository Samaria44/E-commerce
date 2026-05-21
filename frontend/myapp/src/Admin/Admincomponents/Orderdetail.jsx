import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./orderdetail.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BACKEND_ORIGIN}/orders/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <h2>Loading...</h2>;

  return (
    <div className="orderdetail-container">
      <h2>
        Order Details - <span>{order._id?.slice(-6)}</span>
      </h2>

      <p><strong>Customer:</strong> {order.customer}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Date:</strong> {order.date}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Address:</strong> {order.address}</p>

      {order.products && order.products.length > 0 && (
        <table className="orderdetail-table">
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Name</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, idx) => (
              <tr key={idx}>
                <td>
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${BACKEND_ORIGIN}${product?.product?.image || ""}`
                    }
                    alt={product.name}
                    width={60}
                  />
                </td>
                <td>{product.product.name}</td>
                <td>{product.size || "-"}</td>
                <td>{product.qty || 1}</td>
                <td>Rs {product.product.price * (product?.qty || 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate(-1)} className="back-btn">
        <FiArrowLeft size={15} style={{ marginRight: 6 }} />
        Back to Orders
      </button>
    </div>
  );
}
