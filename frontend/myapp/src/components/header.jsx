import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./header.css";
import { useCart } from "./context/CartContext";
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [categories, setCategories]       = useState([]);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileOpenSub, setMobileOpenSub] = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const { cartCount } = useCart();
  const navigate      = useNavigate();
  const isLoggedIn    = !!localStorage.getItem("authToken");

  useEffect(() => {
    axios.get(`${BACKEND_ORIGIN}/categories`)
      .then(r => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className={`nav-root${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">

        {/* Logo */}
        <NavLink to="/" className="nav-logo">
          <FiShoppingBag size={20} />
          Shop<span className="nav-logo-dot">Zone</span>
        </NavLink>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Nav */}
        <ul className={`nav-list${menuOpen ? " open" : ""}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}>Home</NavLink>
          </li>

          {/* Category — desktop hover */}
          <li className="has-dropdown">
            <span className="nav-trigger">
              Category <FiChevronDown size={13} className="nav-chevron" />
            </span>
            <ul className="nav-dropdown">
              {categories.map(cat => (
                <li key={cat._id} className="nav-dd-item">
                  <NavLink
                    to={`/category/${encodeURIComponent(cat.Category)}`}
                    className={({ isActive }) => `nav-dd-link${isActive ? " active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{cat.Category}</span>
                    {cat.subcategories?.length > 0 && <FiChevronRight size={12} className="nav-sub-arrow" />}
                  </NavLink>
                  {cat.subcategories?.length > 0 && (
                    <ul className="nav-sub">
                      {cat.subcategories.map(sub => (
                        <li key={sub._id}>
                          <NavLink
                            to={`/category/${encodeURIComponent(cat.Category)}/sub/${encodeURIComponent(sub.Name)}`}
                            onClick={() => setMenuOpen(false)}
                          >{sub.Name}</NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile accordion */}
            <button className="mob-cat-btn" onClick={() => setMobileCatOpen(p => !p)}>
              Category
              <FiChevronDown size={13} style={{ transition: "transform .25s", transform: mobileCatOpen ? "rotate(180deg)" : "none" }} />
            </button>
            <ul className={`mob-cat-list${mobileCatOpen ? " open" : ""}`}>
              {categories.map(cat => (
                <li key={cat._id}>
                  <div className="mob-cat-row">
                    <NavLink to={`/category/${encodeURIComponent(cat.Category)}`} onClick={() => setMenuOpen(false)}>
                      {cat.Category}
                    </NavLink>
                    {cat.subcategories?.length > 0 && (
                      <button className="mob-sub-toggle"
                        onClick={() => setMobileOpenSub(p => p === cat._id ? null : cat._id)}>
                        <FiChevronDown size={12} style={{ transition: "transform .25s", transform: mobileOpenSub === cat._id ? "rotate(180deg)" : "none" }} />
                      </button>
                    )}
                  </div>
                  {mobileOpenSub === cat._id && (
                    <ul className="mob-sub-list">
                      {cat.subcategories.map(sub => (
                        <li key={sub._id}>
                          <NavLink to={`/category/${encodeURIComponent(cat.Category)}/sub/${encodeURIComponent(sub.Name)}`}
                            onClick={() => setMenuOpen(false)}>{sub.Name}</NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavLink to="/products/new" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}>New Arrivals</NavLink>
          </li>
          <li>
            <NavLink to="/product" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}>Shop</NavLink>
          </li>
          <li>
            <NavLink to="/About" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}>About</NavLink>
          </li>
          <li>
            <NavLink to="/Contactus" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}>Contact</NavLink>
          </li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <form onSubmit={handleSearch} className="nav-search-form">
            <input className="nav-search-input" type="text" placeholder="Search…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit" className="nav-search-btn" aria-label="Search">
              <FiSearch size={15} />
            </button>
          </form>

          <NavLink to="/cart" className="nav-icon-btn" aria-label="Cart">
            <FiShoppingBag size={18} />
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </NavLink>

          <Link to={isLoggedIn ? "/User" : "/Login"} className="nav-icon-btn" aria-label="Account">
            <FiUser size={18} />
          </Link>
        </div>

      </div>
    </header>
  );
}
