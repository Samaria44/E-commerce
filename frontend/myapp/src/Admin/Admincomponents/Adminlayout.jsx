import { Outlet } from "react-router-dom";
import Slidebar from "./AdminSlidebar";
import "./Admin.css";

export default function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Inter', 'Poppins', sans-serif",
      }}
    >
      {/* Sidebar */}
      <Slidebar />

      {/* Main area */}
      <div
        style={{
          flex: 1,
          marginLeft: "260px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
