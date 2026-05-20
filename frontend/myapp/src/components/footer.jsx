import { NavLink } from "react-router-dom";
import {
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="row">
        {/* Brand */}
        <div className="col">
          <div className="logo-footer">
            <FiShoppingBag style={{ marginRight: 8, verticalAlign: "middle" }} />
            ShopZone
          </div>
          <p className="footer-tagline">
            Your one-stop destination for premium fashion and lifestyle products.
            Quality you can trust, style you'll love.
          </p>
        </div>

        {/* Company */}
        <div className="col">
          <h3>Company</h3>
          <ul>
            <li><NavLink to="/About">About Us</NavLink></li>
            <li><NavLink to="/Contactus">Contact</NavLink></li>
            <li><NavLink to="#">Our Team</NavLink></li>
            <li><NavLink to="#">Careers</NavLink></li>
          </ul>
        </div>

        {/* Shop */}
        <div className="col">
          <h3>Shop</h3>
          <ul>
            <li><NavLink to="/Allcollection">All Collection</NavLink></li>
            <li><NavLink to="/products/new">New Arrivals</NavLink></li>
            <li><NavLink to="/product">Shop All</NavLink></li>
            <li><NavLink to="#">Discounts</NavLink></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col">
          <h3>Contact Us</h3>
          <ul>
            <li className="footer-contact-item">
              <FiMapPin className="footer-contact-icon" />
              Bahadur Abad, Karachi
            </li>
            <li className="footer-contact-item">
              <FiPhone className="footer-contact-icon" />
              +92 333 227 9263
            </li>
            <li className="footer-contact-item">
              <FiMail className="footer-contact-icon" />
              ask@wearzane.com
            </li>
            <li className="footer-contact-item">
              <FiClock className="footer-contact-icon" />
              Mon–Fri: 10am–5pm
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopZone. All rights reserved.</p>
        <p>Made with care in Pakistan</p>
      </div>
    </footer>
  );
}
