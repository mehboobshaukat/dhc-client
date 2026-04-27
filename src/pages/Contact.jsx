import { useState, useEffect } from "react";
import { getToken } from "../utils/auth.js";
import { countries } from "./countries.js";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    userEmail: "",
    country: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});

  // OPTIONAL: agar user login hai to email auto fill
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5285/api/auth/get-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          userEmail: data.email || "",
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5285/api/contact/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");

      alert("✅ Message sent successfully!");

      setForm({
        name: "",
        userEmail: "",
        country: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us today.</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          {/* Left Side - Contact Info */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Us</h3>
              <p>123 Developer Street<br />Tech Valley, SV 12345</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Us</h3>
              <p>hello@developershub.com<br />support@developershub.com</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM</p>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form-wrapper">
            <h2>Send us a Message</h2>
            <p className="form-subtitle">We'll get back to you within 24 hours</p>

            <form onSubmit={handleSubmit} className="contact-form">
              {/* Name Field */}
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder=" "
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  required
                  disabled={loading}
                />
                <label htmlFor="name">Full Name</label>
                <span className="input-icon">👤</span>
              </div>

              {/* Email Field */}
              <div className="input-group">
                <input
                  type="email"
                  name="userEmail"
                  id="email"
                  placeholder=" "
                  value={form.userEmail}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  required
                  disabled={loading}
                />
                <label htmlFor="email">Email Address</label>
                <span className="input-icon">📧</span>
              </div>

              {/* Country Dropdown */}
              <div className="input-group select-group">
                <select
                  name="country"
                  id="country"
                  value={form.country}
                  onChange={handleChange}
                  onFocus={() => handleFocus("country")}
                  onBlur={() => handleBlur("country")}
                  disabled={loading}
                >
                  <option value="">Select your country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <label htmlFor="country">Country</label>
                <span className="input-icon">🌍</span>
              </div>

              {/* Subject Field */}
              <div className="input-group">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder=" "
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus("subject")}
                  onBlur={() => handleBlur("subject")}
                  required
                  disabled={loading}
                />
                <label htmlFor="subject">Subject</label>
                <span className="input-icon">📝</span>
              </div>

              {/* Message Field */}
              <div className="input-group textarea-group">
                <textarea
                  name="message"
                  id="message"
                  placeholder=" "
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus("message")}
                  onBlur={() => handleBlur("message")}
                  required
                  disabled={loading}
                ></textarea>
                <label htmlFor="message">Your Message</label>
                <span className="input-icon">💬</span>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3386.123456789!2d74.873456!3d32.099876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f123456789abc%3A0xabcdef123456789!2sNarowal%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1712345678901!5m2!1sen!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;