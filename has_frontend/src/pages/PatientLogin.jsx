import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Alert state (same pattern as Doctor/Admin)
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type });
    }, 3000);
    globalShowAlert?.(message, type);
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
      const response = await api.post("/user-login/", formData);

      login("patient", response.data);

      showAlert("Login successful! Welcome back 👋");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Invalid email or password",
        "error"
      );
    }
  };

  return (
    <div className="register-container">

      {/* 🔔 ALERT */}
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Login</h1>

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
            onClick={() => navigate("/user-register")}
          >
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
};

export default PatientLogin;
