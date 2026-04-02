import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
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
    if (duration > 0) {
      setTimeout(() => {
        setAlert({ show: false, message: "", type });
      }, duration);
    }
    globalShowAlert?.(message, type, duration);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/admin/login/", formData);

      login("admin", res.data);

      const duration = 1500;
      showAlert("Welcome Admin 👋 Login successful", "welcome", duration);
      setTimeout(() => navigate("/admin/dashboard"), duration);

    } catch (err) {
      // ✅ BETTER ERROR HANDLING
      let errorMessage = "Unable to login. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Invalid username or password ❌";
      } else if (err.response?.status === 403) {
        errorMessage = "Access denied. Admin only ⚠️";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      showAlert(errorMessage, "error");
    }
  };

  return (
    <div className="register-container">

      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form
        className="register-card"
        style={{ paddingBottom: "30px", marginBottom: "55px" }}
        onSubmit={handleSubmit}
      >
        <h1>
          <FaUserShield /> Admin Login
        </h1>

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
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
      </form>
    </div>
  );
};

export default AdminLogin;
