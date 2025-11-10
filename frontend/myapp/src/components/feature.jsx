import { useState, useEffect } from "react";
import "./feature.css";

import { FaBoxOpen, FaShieldAlt, FaShippingFast } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";

export default function Custom() {
  const [isVisible, setIsVisible] = useState(false);

  // Fade-in effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // small delay for smooth animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`container ${isVisible ? "visible" : "hidden"}`}>
      <div className="custom">
        <h1>
          Customer experience is <br />
          important to us
        </h1>
        <p>
          Sed dictum ipsum elementum diam dapibus, ut sodales orci nonante
          consectetur. Fusce a mollis lorem. Orci varius natoque penatibus.
        </p>

        <div className="cus-col-container">
          <div className="cus-col">
            <div className="icon">
              <FaBoxOpen />
            </div>
            <h3>Original products</h3>
            <p>
              Nascetur ridiculus mus. Donec ac odio ac lorem blandit viverra.
              Donec sed iaculis nisi, eget laoreet odio.
            </p>
          </div>

          <div className="cus-col">
            <div className="icon">
              <FaShieldAlt />
            </div>
            <h3>Satisfaction guarantee</h3>
            <p>
              Non blandit libero elit, vitae dolor viverra luctus turpis. Aenean
              faucibus orci ac auctor luctus.
            </p>
          </div>

          <div className="cus-col">
            <div className="icon">
              <MdNewReleases />
            </div>
            <h3>New arrival everyday</h3>
            <p>
              Vestibulum porta arcu at rhoncus scelerisque, lectus sapien varius
              sapien lacinia sem.
            </p>
          </div>

          <div className="cus-col">
            <div className="icon">
              <FaShippingFast />
            </div>
            <h3>Fast & free shipping</h3>
            <p>
              Curabitur libero eros, viverra et semper at, tempus vel nisi. In
              eget lacus nec neque sollicitudin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
