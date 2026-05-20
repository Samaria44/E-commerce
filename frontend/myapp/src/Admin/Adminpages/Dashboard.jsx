import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Admincomponents/Admin.css";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiLogOut,
} from "react-icons/fi";

export default function Admin() {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/dashboard/login");
  }, [navigate]);

  // Fetch counts
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [productRes, orderRes] = await Promise.all([
          fetch("http://localhost:8000/products"),
          fetch("http://localhost:8000/orders"),
        ]);
        const products = await productRes.json();
        const orders = await orderRes.json();
        setTotalProducts(products.length);
        setTotalOrders(orders.length);
        setPendingOrders(
          orders.filter((o) => o.status === "Pending" || !o.status).length
        );
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    };
    loadCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/dashboard/login");
  };

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: <FiPackage size={22} />,
      className: "product-card",
      trend: "Active listings",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <FiShoppingBag size={22} />,
      className: "order-card",
      trend: `${pendingOrders} pending`,
    },
    {
      label: "Registered Users",
      value: "—",
      icon: <FiUsers size={22} />,
      className: "user-card",
      trend: "All time",
    },
    {
      label: "Revenue",
      value: "—",
      icon: <FiTrendingUp size={22} />,
      className: "revenue-card",
      trend: "This month",
    },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Admin</p>
        </div>
        <div className="admin-header-right">
          <div className="admin-avatar">A</div>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div
        style={{
          marginTop: "68px",
          padding: "32px",
        }}
      >
        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className={`card ${stat.className}`}>
              <div className="card-icon">{stat.icon}</div>
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
              <div className="card-trend">↑ {stat.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
