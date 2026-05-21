import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiShoppingBag, FiHeart } from "react-icons/fi";
import "./addtocart.css";

export default function User() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/Login");
  };

  return (
    <div className="page-container" style={{ maxWidth: 600 }}>
      <div style={{
        background: "var(--dark-2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-xl)",
        padding: "48px 40px",
        textAlign: "center",
      }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "var(--shadow-accent)",
        }}>
          <FiUser size={32} color="#fff" />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--white)", marginBottom: 6, letterSpacing: "-0.3px" }}>
          Welcome back!
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 36 }}>
          You're logged in as a customer
        </p>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {[
            { icon: <FiShoppingBag size={16} />, label: "My Orders", to: "/" },
            { icon: <FiHeart size={16} />, label: "Wishlist", to: "/" },
          ].map(item => (
            <button key={item.label}
              onClick={() => navigate(item.to)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: "var(--dark-3)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                color: "var(--white-60)",
                fontSize: 14, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--white)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--white-60)"; }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <button onClick={handleLogout}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 28px",
            background: "transparent",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--r-md)",
            color: "var(--muted-2)",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-2)"; }}
        >
          <FiLogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}
