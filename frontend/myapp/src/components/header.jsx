import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./header.css";
import { useCart } from "./context/CartContext";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";

const BACKEND_ORIGIN = "http://localhost:8000";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");
  const [isSticky, setIsSticky] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories — backend returns { _id, Category, subcategories: [{ _id, Name }] }
  useEffect(() => {
    axios
      .get(`${BACKEND_ORIGIN}/categories`)
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={`navbar-wrapper ${isSticky ? "sticky" : ""}`}>
      <nav className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="logo">
          <FiShoppingCart size={20} style={{ color: "#e91e63" }} />
          ShopZone
        </NavLink>

        {/* Mobile toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Nav links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>

          {/* Category dropdown */}
          <li className="has-dropdown">
            <button className="dropdown-toggle">Category</button>
            <ul className="dropdown-menu">
              {categories.map((cat) => (
                <li key={cat._id} className="has-sub-dropdown">
                  {/* Fixed: use cat.Category (backend field name) */}
                  <NavLink
                    to={`/category/${encodeURIComponent(cat.Category)}`}
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.Category}
                  </NavLink>

                  {/* Fixed: use sub.Name and correct URL pattern /category/:name/sub/:sub */}
                  {cat.subcategories?.length > 0 && (
                    <ul className="sub-dropdown">
                      {cat.subcategories.map((sub) => (
                        <li key={sub._id}>
                          <NavLink
                            to={`/category/${encodeURIComponent(cat.Category)}/sub/${encodeURIComponent(sub.Name)}`}
                            className={({ isActive }) => (isActive ? "active-link" : "")}
                            onClick={() => setMenuOpen(false)}
                          >
                            {sub.Name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavLink
              to="/products/new"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuOpen(false)}
            >
              New Arrival
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/product"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/Contactus"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right actions */}
        <div className="nav-actions">
          <form onSubmit={handleSearch} className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <FiSearch size={15} />
            </button>
          </form>

          <NavLink to="/cart" className="cart-icon" aria-label="Cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

          <Link
            to={isLoggedIn ? "/User" : "/Login"}
            className="user-icon"
            aria-label="Account"
          >
            <FiUser size={20} />
          </Link>
        </div>

      </nav>
    </div>
  );
};

export default Header;
