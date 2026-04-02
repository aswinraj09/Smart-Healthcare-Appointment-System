import "./Contact.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
  setAlert({ show: true, message, type });

  setTimeout(() => {
    setAlert({ show: false, message: "", type });
  }, 3000);
  globalShowAlert?.(message, type);
};

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post("/contact/", formData);

    showAlert(res.data.message || "Thank you! We’ll get back to you shortly.");

    setFormData({ name: "", email: "", message: "" });
  } catch (err) {
    showAlert(
      err.response?.data?.message || "Failed to send message",
      "error"
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="contact-page">

      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We’re here to help you.</p>
      </section>

      <section className="contact-container">

        <div className="contact-info">
          <div className="info-card">
            <FaEnvelope />
            <h3>Email</h3>
            <p>smarthealthcareappointmentsyst@gmail.com</p>
          </div>

          <div className="info-card">
            <FaPhoneAlt />
            <h3>Phone</h3>
            <p>+91 99999 99999</p>
          </div>

          <div className="info-card">
            <FaMapMarkerAlt />
            <h3>Location</h3>
            <p>Bangalore, India</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
