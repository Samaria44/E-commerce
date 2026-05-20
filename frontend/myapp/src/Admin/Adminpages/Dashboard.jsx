import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Admincomponents/Admin.css";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiLogOut,
  FiArrowUp,
} from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/dashboard/login");
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          fetch("http://localhost:8000/products"),
          fetch("http://localhost:8000/orders"),
        ]);
        const products = await pRes.json();
        const orders = await oRes.json();
        setTotalProducts(Array.isArray(products) ? products.length : 0);
        setTotalOrders(Array.isArray(orders) ? orders.length : 0);
        setPendingOrders(
          Array.isArray(orders)
            ? orders.filter((o) => !o.status || o.status === "Pending").length
            : 0
        );
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    load();
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
      value: "N/A",
      icon: <FiUsers size={22} />,
      className: "user-card",
      trend: "All time",
    },
    {
      label: "Revenue",
      value: "N/A",
      icon: <FiTrendingUp size={22} />,
      className: "revenue-card",
      trend: "This month",
    },
  ];

  return (
    <>
      {/* Fixed top header */}
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

      {/* Page body — pushed below fixed header */}
      <div style={{ marginTop: "68px", padding: "32px" }}>
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
              <div className="card-trend">
                <FiArrowUp size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
