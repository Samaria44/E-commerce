import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./header.css";
import { useCart } from "./context/CartContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");
  const [isSticky, setIsSticky] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories dynamically
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`navbar-wrapper ${isSticky ? "sticky" : ""}`}>
      <nav className="navbar-container">
        <div className="logo">
          <i className="fa-solid fa-play"></i> Logo
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa-solid fa-bars"></i>
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Home
            </NavLink>
          </li>

          <li className="has-dropdown">
            <button className="dropdown-toggle">Category</button>
            <ul className="dropdown-menu">
              {categories.map((cat) => (
                <li key={cat._id} className="has-sub-dropdown">
                  <NavLink to={`/category/${cat.name}`} className={({ isActive }) => (isActive ? "active-link" : "")}>
                    {cat.name}
                  </NavLink>

                  {cat.subCategories.length > 0 && (
                    <ul className="sub-dropdown">
                      {cat.subCategories.map((sub) => (
                        <li key={sub._id}>
                          <NavLink
                            to={`/category/${cat.name}/${sub.name}`}
                            className={({ isActive }) => (isActive ? "active-link" : "")}
                          >
                            {sub.name}
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

        <div className="nav-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <NavLink to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

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
