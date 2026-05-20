import { NavLink } from "react-router-dom";
import "./Admin.css";
import {
  FiGrid,
  FiPackage,
  FiTag,
  FiShoppingBag,
  FiMessageSquare,
  FiShoppingCart,
} from "react-icons/fi";

const navItems = [
  { to: "/dashboard",            label: "Dashboard",  icon: <FiGrid size={16} />,         end: true },
  { to: "/dashboard/products",   label: "Products",   icon: <FiPackage size={16} /> },
  { to: "/dashboard/categories", label: "Categories", icon: <FiTag size={16} /> },
  { to: "/dashboard/orders",     label: "Orders",     icon: <FiShoppingBag size={16} /> },
  { to: "/dashboard/users",      label: "Messages",   icon: <FiMessageSquare size={16} /> },
];

export default function Slidebar() {
  return (
    <div className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FiShoppingCart size={18} color="#fff" />
        </div>
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
