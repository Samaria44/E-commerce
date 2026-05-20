import { NavLink } from "react-router-dom";
import "./Admin.css";
import {
  FiGrid,
  FiPackage,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
} from "react-icons/fi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/dashboard/products", label: "Products", icon: <FiPackage /> },
  { to: "/dashboard/categories", label: "Categories", icon: <FiTag /> },
  { to: "/dashboard/orders", label: "Orders", icon: <FiShoppingBag /> },
  { to: "/dashboard/users", label: "Messages", icon: <FiMessageSquare /> },
];

export default function Slidebar() {
  return (
    <div className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🛍️</div>
        <div>
          <div className="sidebar-brand-text">ShopAdmin</div>
          <div className="sidebar-brand-sub">Management Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <ul>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
