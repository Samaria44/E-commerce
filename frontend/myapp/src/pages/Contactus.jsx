import { useState } from "react";
import axios from "axios";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import "./addtocart.css";

const BACKEND_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/contact`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(BACKEND_URL, form);
      setSuccess("Message sent! We'll get back to you soon.");
      setError("");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-title-row">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-form-card">
          <h2>Send a Message</h2>
          <p>Fill out the form below and our team will get back to you as soon as possible.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="form-field">
                <label className="form-label">Name</label>
                <input className="form-input" type="text" name="name"
                  value={form.name} onChange={onChange} placeholder="Your name" required />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email"
                  value={form.email} onChange={onChange} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" name="phone"
                value={form.phone} onChange={onChange} placeholder="+92 300 0000000" required />
            </div>
            <div className="form-field">
              <label className="form-label">Subject</label>
              <input className="form-input" type="text" name="subject"
                value={form.subject} onChange={onChange} placeholder="How can we help?" required />
            </div>
            <div className="form-field">
              <label className="form-label">Message</label>
              <textarea className="form-input" name="message" rows="5"
                value={form.message} onChange={onChange} placeholder="Write your message…" required />
            </div>
            <button type="submit" className="contact-submit-btn">Send Message</button>
            {success && <p className="form-feedback success">{success}</p>}
            {error   && <p className="form-feedback error">{error}</p>}
          </form>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-block">
            <h4>Contact Details</h4>
            <div className="contact-info-row"><FiMapPin size={14} className="contact-info-icon" />Bahadur Abad, Karachi, Pakistan</div>
            <div className="contact-info-row"><FiPhone size={14} className="contact-info-icon" />+92 333 227 9263</div>
            <div className="contact-info-row"><FiMail size={14} className="contact-info-icon" />ask@wearzane.com</div>
            <div className="contact-info-row"><FiClock size={14} className="contact-info-icon" />Mon – Fri: 10am – 5pm</div>
          </div>

          <hr className="contact-divider" />

          <div className="contact-info-block">
            <h4>Customer Support</h4>
            <p style={{ fontSize: 14, color: "var(--muted-2)", lineHeight: 1.7 }}>
              Have a question about your order? Our support team is here to help you every step of the way.
            </p>
          </div>

          <hr className="contact-divider" />

          <div className="contact-info-block">
            <h4>Follow Us</h4>
            <div className="social-row">
              <a href="#" className="social-btn" aria-label="Facebook">f</a>
              <a href="#" className="social-btn" aria-label="Instagram">in</a>
              <a href="#" className="social-btn" aria-label="WhatsApp">w</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
