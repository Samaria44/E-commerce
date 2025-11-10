import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";


export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`footer-container ${isVisible ? "visible" : "hidden"}`}>
      <footer className="footer">
        <div className="row">
          <div className="col">
            <div className="logo-footer">
              <i className="fa-solid fa-play"></i> Logo
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
              dolor neque voluptate ut, aliquam qui veritatis asperiores fugiat at
              quam odio reprehenderit consequuntur ipsa vel saepe, molestias vitae?
              Excepturi, rem!
            </p>
          </div>

          <div className="col">
            <h3>Company</h3>
            <ul>
              <li><NavLink to ="/About">About us </NavLink></li>
              <li><NavLink to="/Contactus">Contact </NavLink></li>
              <li><NavLink to="#">Our Team </NavLink></li>
            </ul>
          </div>

          <div className="col">
            <h3>Shop</h3>
            <ul>
              <li><NavLink to ="/Allcollection">All Collection</NavLink></li>
              <li><NavLink to ="#">Winter Edition</NavLink></li>
              <li><NavLink to ="#">Discount</NavLink></li>
            </ul>
          </div>

          <div className="col">
            <h3>Contact Us</h3>
            <ul>
              <li>Address: <span>sdjksfjdjij</span></li>
              <li>Phone: <span>+92167128362</span></li>
              <li>Email: <span>example@gmail.com</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
