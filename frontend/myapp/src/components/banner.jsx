import { useState, useEffect } from "react";
import CaptureImg from "./Capture.PNG";
import "./banner.css";

export default function Last() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // short delay for animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`last-section container ${isVisible ? "visible" : "hidden"}`}>
      {/* Banner Section */}
      <div className="banner">
        <div className="banner-text">
          <h2>
            45% off only this week
            <br />
            and get special gift
          </h2>
          <p>
            Pellentesque ac malesuada justo. Nulla vulputate lacus turpis et ultricies.
            In malesuada turpis quis faucibus. Curabitur mollis lectus quis augue.
          </p>
          <button>Grab it now</button>
        </div>

        <div className="banner-image">
          <img src={CaptureImg} alt="Promo" />
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="subscribe">
        <h3>Subscribe and get updates to our latest collections</h3>
        <p>
          Sed dictum ipsum elementum diam dapibus, ut sodales est maximus consectetur.
          Fusce a mollis lorem. Orci varius natoque penatibus.
        </p>
        <form>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
