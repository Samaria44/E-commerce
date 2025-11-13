import React, { useState } from "react";
import axios from "axios";
import "./addtocart.css";

const BACKEND_URL = "http://localhost:8000/contact"; // change if different

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BACKEND_URL, formData);
      setSuccess("Your message has been sent!");
      setError("");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="container">
      <section className="contact-container">
        <div className="contact-left">
          <h2>Drop Us A Line</h2>
          <p>
            Thank you for your interest in contacting us. We value your feedback
            and look forward to hearing from you.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>

            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>

            <button type="submit">Send</button>
          </form>
          {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>

        <div className="contact-right">
          <h4>CONTACT DETAILS :</h4>
          <p>Address: P.No. 16/104 BLK-3 BAHADUR YAR JUNG C H S BAHADUR ABAD</p>
          <p>PHONE : +92 333 227 9263 (ZANE)</p>
          <p>EMAIL: ask@wearzane.com</p>

          <hr />

          <h4>Customer Support</h4>
          <p>MON - FRI : 10am - 5pm</p>
          <p>If you have any feedback, questions, or concerns, please don’t hesitate to reach out to us.</p>

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
