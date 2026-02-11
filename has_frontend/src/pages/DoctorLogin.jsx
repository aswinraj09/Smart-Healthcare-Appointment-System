import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Auth context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success", duration = 3000) => {
    setAlert({ show: true, message, type });
    if (duration > 0) setTimeout(() => setAlert({ show: false, message: "", type }), duration);
    globalShowAlert?.(message, type, duration);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showAlert("Email and password are required", "error");
      return;
    }

    try {
      const response = await api.post("/login/", formData);

      login("doctor", response.data);

      // Show a custom 'welcome' alert and navigate after the same duration
      const duration = 1500;
      showAlert("Login successful! Welcome back 👨‍⚕️", "welcome", duration);

      setTimeout(() => {
        navigate("/doctor-dashboard");
      }, duration);

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Invalid email or password",
        "error"
      );
    }
  };

  return (
    <div className="register-container">

      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Doctor Login</h1>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Login</button>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <span
            className="underline-link"
            onClick={() => navigate("/doctor-register")}
          >
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
};

export default DoctorLogin;
