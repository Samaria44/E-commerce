import { NavLink } from "react-router-dom";
import "./Slidebar.css";

export default function Slidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/dashboard/products">Products</NavLink></li>
        <li><NavLink to="/dashboard/orders">Orders</NavLink></li>
        <li><NavLink to="/dashboard/users">Users</NavLink></li>
      </ul>
    </div>
  );
}
