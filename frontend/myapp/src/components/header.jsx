import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { useCart } from "./context/CartContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");
  const [isSticky, setIsSticky] = useState(false);

  // ✅ Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ✅ Sticky Navbar Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`navbar-wrapper ${isSticky ? "sticky" : ""}`}>
      <nav className="navbar-container">
        <div className="logo">
          <i className="fa-solid fa-play"></i> Logo
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Home
            </NavLink>
          </li>

          <li className="has-dropdown">
            <button className="dropdown-toggle">Category</button>
            <ul className="dropdown-menu">
              <li>
                <NavLink to="/Men" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Men
                </NavLink>
              </li>
              <li>
                <NavLink to="/Women" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Women
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <NavLink to="products/new" className={({ isActive }) => (isActive ? "active-link" : "")}>
              New Arrival
            </NavLink>
          </li>

          <li>
            <NavLink to="/product" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Shop
            </NavLink>
          </li>

          <li>
            <NavLink to="/Contactus" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Search + Icons */}
        <div className="nav-actions">
          <div className="search-wrapper">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
              </button>
            </form>
          </div>

          {/* Cart */}
          <NavLink to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

          {/* User Icon */}
          {isLoggedIn ? (
            <Link to="/User" className="fas fa-user"></Link>
          ) : (
            <Link to="/Login" className="fas fa-user"></Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
