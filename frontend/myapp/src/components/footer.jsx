import { NavLink } from "react-router-dom";
import { FiShoppingBag, FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">
              <FiShoppingBag size={20} />
              Shop<span>Zone</span>
            </div>
            <p className="footer-tagline">
              Your destination for premium fashion. Quality you can trust, style you'll love — crafted with care in Pakistan.
            </p>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><NavLink to="/About">About Us</NavLink></li>
              <li><NavLink to="/Contactus">Contact</NavLink></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><NavLink to="/product">All Products</NavLink></li>
              <li><NavLink to="/products/new">New Arrivals</NavLink></li>
              <li><NavLink to="/Allcollection">Collection</NavLink></li>
              <li><a href="#">Discounts</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li className="footer-contact-row"><FiMapPin size={14} className="footer-contact-icon" />Bahadur Abad, Karachi</li>
              <li className="footer-contact-row"><FiPhone size={14} className="footer-contact-icon" />+92 333 227 9263</li>
              <li className="footer-contact-row"><FiMail size={14} className="footer-contact-icon" />ask@wearzane.com</li>
              <li className="footer-contact-row"><FiClock size={14} className="footer-contact-icon" />Mon–Fri: 10am–5pm</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopZone. All rights reserved.</p>
          <p>Made with care in Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
