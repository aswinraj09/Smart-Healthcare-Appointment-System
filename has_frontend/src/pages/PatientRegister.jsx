import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAlert } from "../context/AlertContext";

const PatientRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    accept_terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Alert state
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

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = ["Name is required"];
    else if (formData.name.length < 3) newErrors.name = ["Name must be at least 3 characters"];

    if (!formData.age) newErrors.age = ["Age is required"];
    else if (formData.age < 1 || formData.age > 120) newErrors.age = ["Enter a valid age"];

    if (!formData.gender) newErrors.gender = ["Gender is required"];

    if (!formData.phone_number) newErrors.phone_number = ["Phone number is required"];
    else if (!/^\d{10}$/.test(formData.phone_number))
      newErrors.phone_number = ["Phone number must be 10 digits"];

    if (!formData.email) newErrors.email = ["Email is required"];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = ["Invalid email format"];

    if (!formData.password) newErrors.password = ["Password is required"];
    else if (formData.password.length < 6)
      newErrors.password = ["Password must be at least 6 characters"];

    if (!formData.confirm_password)
      newErrors.confirm_password = ["Confirm password is required"];
    else if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = ["Passwords do not match"];

    if (!formData.accept_terms)
      newErrors.accept_terms = ["You must accept the Terms & Conditions"];

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post("/user-register/", formData);

      showAlert("Signup successfully 🎉");

      setTimeout(() => {
        navigate("/user-login");
      }, 1500);

      setFormData({
        name: "",
        age: "",
        gender: "",
        phone_number: "",
        email: "",
        password: "",
        confirm_password: "",
        accept_terms: false,
      });

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Registration failed",
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
        <h1>Signup</h1>

        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="field-error">{errors.name[0]}</p>}

        <label>Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
        {errors.age && <p className="field-error">{errors.age[0]}</p>}

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="field-error">{errors.gender[0]}</p>}

        <label>Phone Number</label>
        <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
        {errors.phone_number && <p className="field-error">{errors.phone_number[0]}</p>}

        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p className="field-error">{errors.email[0]}</p>}

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="field-error">{errors.password[0]}</p>}

        <label>Confirm Password</label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirm_password && <p className="field-error">{errors.confirm_password}</p>}

        <div className="terms-wrapper">
          <input
            type="checkbox"
            name="accept_terms"
            checked={formData.accept_terms}
            onChange={handleChange}
            style={{ width: "13px", marginTop: "13px" }}
          />
          <label>
            I agree to the{" "}
            <span className="terms-link" onClick={() => navigate("/terms")}>
              Terms & Conditions
            </span>
          </label>
        </div>
        {errors.accept_terms && <p className="field-error">{errors.accept_terms[0]}</p>}

        <button type="submit">Signup</button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span className="underline-link" onClick={() => navigate("/user-login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default PatientRegister;
