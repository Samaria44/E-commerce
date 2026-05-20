import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="row">
        <div className="col">
          <div className="logo-footer">🛍️ ShopZone</div>
          <p className="footer-tagline">
            Your one-stop destination for premium fashion and lifestyle products.
            Quality you can trust, style you'll love.
          </p>
        </div>

        <div className="col">
          <h3>Company</h3>
          <ul>
            <li><NavLink to="/About">About Us</NavLink></li>
            <li><NavLink to="/Contactus">Contact</NavLink></li>
            <li><NavLink to="#">Our Team</NavLink></li>
            <li><NavLink to="#">Careers</NavLink></li>
          </ul>
        </div>

        <div className="col">
          <h3>Shop</h3>
          <ul>
            <li><NavLink to="/Allcollection">All Collection</NavLink></li>
            <li><NavLink to="/products/new">New Arrivals</NavLink></li>
            <li><NavLink to="/product">Shop All</NavLink></li>
            <li><NavLink to="#">Discounts</NavLink></li>
          </ul>
        </div>

        <div className="col">
          <h3>Contact Us</h3>
          <ul>
            <li>📍 Bahadur Abad, Karachi</li>
            <li>📞 +92 333 227 9263</li>
            <li>✉️ ask@wearzane.com</li>
            <li>🕐 Mon–Fri: 10am–5pm</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopZone. All rights reserved.</p>
        <p>Made with ❤️ in Pakistan</p>
      </div>
    </footer>
  );
}
