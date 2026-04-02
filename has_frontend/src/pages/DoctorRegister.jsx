import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAlert } from "../context/AlertContext";

const DoctorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    specialization: "",
    qualification: "",
    experience: "",
    phone_number: "",
    email: "",
    photo: null,
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* 🔔 ALERT STATE */
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type });
    }, 3000);
    globalShowAlert?.(message, type);
  };

  /* IMAGE DIMENSION CHECK */
  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve(img.width === 260 && img.height === 280);
      };
    });
  };

  /* FORM VALIDATION */
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim() || formData.name.length < 3)
      newErrors.name = ["Name must be at least 3 characters"];

    if (!formData.age || formData.age < 18 || formData.age > 100)
      newErrors.age = ["Age must be between 18 and 100"];

    if (!formData.gender)
      newErrors.gender = ["Gender is required"];

    if (!formData.specialization.trim())
      newErrors.specialization = ["Specialization is required"];

    if (!formData.qualification.trim())
      newErrors.qualification = ["Qualification is required"];

    if (!formData.experience || formData.experience < 0 || formData.experience > 60)
      newErrors.experience = ["Experience must be between 0 and 60 years"];

    if (!/^\d{10}$/.test(formData.phone_number))
      newErrors.phone_number = ["Phone number must be 10 digits"];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = ["Invalid email format"];

    if (!formData.password || formData.password.length < 6)
      newErrors.password = ["Password must be at least 6 characters"];

    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = ["Passwords do not match"];

    if (formData.photo) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(formData.photo.type))
        newErrors.photo = ["Only JPG, JPEG, PNG allowed"];
      else if (formData.photo.size > 2 * 1024 * 1024)
        newErrors.photo = ["Image must be under 2MB"];
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.photo) {
      const validSize = await validateImageDimensions(formData.photo);
      if (!validSize) {
        setErrors({ photo: ["Image must be exactly 260 × 280 pixels"] });
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        formDataToSend.append(key, formData[key])
      );

      await api.post("/doctor-register/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert(
        "Registration successful! Waiting for admin approval.",
        "success"
      );

      setTimeout(() => navigate("/doctor-login"), 2500);

      setFormData({
        name: "",
        age: "",
        gender: "",
        specialization: "",
        qualification: "",
        experience: "",
        phone_number: "",
        email: "",
        photo: null,
        password: "",
        confirm_password: "",
      });

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Registration failed",
        "error"
      );
      if (err.response?.data) setErrors(err.response.data);
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
        <h1>Doctor Signup</h1>

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
        </select>
        {errors.gender && <p className="field-error">{errors.gender[0]}</p>}

        <label>Specialization</label>
        <input name="specialization" value={formData.specialization} onChange={handleChange} />
        {errors.specialization && <p className="field-error">{errors.specialization[0]}</p>}

        <label>Qualification</label>
        <input name="qualification" value={formData.qualification} onChange={handleChange} />
        {errors.qualification && <p className="field-error">{errors.qualification[0]}</p>}

        <label>Experience</label>
        <input type="number" name="experience" value={formData.experience} onChange={handleChange} />
        {errors.experience && <p className="field-error">{errors.experience[0]}</p>}

        <label>Phone Number</label>
        <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
        {errors.phone_number && <p className="field-error">{errors.phone_number[0]}</p>}

        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p className="field-error">{errors.email[0]}</p>}

        <label>Photo (optional)</label>
        <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        <small className="ux-tip">260×280px • JPG/PNG • Max 2MB</small>
        {errors.photo && <p className="field-error">{errors.photo[0]}</p>}

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

        <button type="submit">Signup</button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span className="underline-link" onClick={() => navigate("/doctor-login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default DoctorRegister;
