import "./addtocart.css";

export default function Contact() {
  return (
    <div className="container">
    <section className="contact-container">
      <div className="contact-left">
        <h2>Drop Us A Line</h2>
        <p>
          Thank you for your interest in contacting us. We value your feedback
          and look forward to hearing from you. Here are the different ways you
          can get in touch with us:
        </p>

        <form className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
          </div>

          <input type="tel" placeholder="Phone Number" required />
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Message" rows="5" required></textarea>

          <button type="submit">Send</button>
        </form>
      </div>

      <div className="contact-right">
        <h4>CONTACT DETAILS :</h4>
        <p>
          Address: P.No. 16/104 BLK-3 BAHADUR YAR JUNG C H S BAHADUR ABAD
        </p>
        <p>PHONE : +92 333 227 9263 (ZANE)</p>
        <p>EMAIL: ask@wearzane.com</p>

        <hr />

        <h4>Customer Support</h4>
        <p>MON - FRI : 10am - 5pm</p>
        <p>
          If you have any feedback, questions, or concerns, please don’t
          hesitate to reach out to us. We value our customers and are committed
          to providing excellent service. Thank you for choosing our brand!
        </p>

        <hr />

        <h4>STAY CONNECTED</h4>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-whatsapp"></i></a>
        </div>
      </div>
    </section>
    </div>
  );
}
