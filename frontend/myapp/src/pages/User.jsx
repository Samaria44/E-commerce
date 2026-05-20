import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/Login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        fontFamily: "'Inter', 'Poppins', sans-serif",
        gap: "24px",
        padding: "40px 20px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e91e63, #c2185b)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          color: "#fff",
          fontWeight: "700",
          boxShadow: "0 8px 24px rgba(233,30,99,0.25)",
        }}
      >
        U
      </div>

      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "6px",
          }}
        >
          Welcome back!
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          You are logged in as a customer
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "#fff",
          color: "#374151",
          padding: "11px 28px",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "#ef4444";
          e.target.style.color = "#ef4444";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "#e5e7eb";
          e.target.style.color = "#374151";
        }}
      >
        Logout
      </button>
    </div>
  );
}
