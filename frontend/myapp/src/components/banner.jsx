import { FiArrowRight, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./banner.css";

export default function Banner() {
  return (
    <div className="banner-section">
      <div className="promo-banner">
        <div className="promo-banner-text">
          <div className="promo-tag"><FiZap size={10} /> Limited Time Offer</div>
          <h2>Get <span>45% Off</span><br />This Week Only</h2>
          <p>
            Exclusive deals on our premium collection. Don't miss out — offer ends Sunday.
            Shop now and save big on your favourite styles.
          </p>
          <Link to="/product">
            <button className="promo-btn">Grab the Deal <FiArrowRight size={15} /></button>
          </Link>
        </div>
        <div className="promo-banner-img">
          <img
            src="https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Promo"
          />
        </div>
      </div>

      <div className="subscribe-section">
        <h3>Stay Ahead of the Trend</h3>
        <p>Subscribe to get early access to new arrivals, exclusive deals, and style inspiration delivered to your inbox.</p>
        <form className="subscribe-form" onSubmit={e => e.preventDefault()}>
          <input className="subscribe-input" type="email" placeholder="Enter your email address" required />
          <button type="submit" className="subscribe-btn">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
