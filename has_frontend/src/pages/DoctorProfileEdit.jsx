import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorProfile.css";

const DoctorProfileEdit = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
  });

  /* 🔔 LOGIN STYLE ALERT */
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

  /* ✅ HOOKS ALWAYS RUN */
  useEffect(() => {
    if (!loading && user?.doctor_id) {
      api
        .get(`/doctor/profile/${user.doctor_id}/`)
        .then((res) => {
          setFormData({
            name: res.data.name || "",
            specialization: res.data.specialization || "",
            qualification: res.data.qualification || "",
            experience: res.data.experience || "",
          });
        })
        .catch(() => showAlert("Failed to load profile ❌", "error"))
        .finally(() => setProfileLoading(false));
    }
  }, [loading, user?.doctor_id]);

  /* 🛑 SAFE RENDER GUARDS (AFTER HOOKS) */
  if (loading || profileLoading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!user || !user.doctor_id) {
    return null;
  }

  /* CHANGE */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (photo) data.append("photo", photo);

    try {
      await api.put(
        `/doctor/profile/update/${user.doctor_id}/`,
        data
      );

      showAlert("Profile updated successfully ✅");

      setTimeout(() => {
        navigate("/doctor/profile");
      }, 1500);

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Update failed ❌",
        "error"
      );
    }
  };

  return (
    <div className="profile-page">

      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="profile-card" style={{marginBottom: '144px'}}>
        <h1>Edit Profile</h1>

        <form className="profile-form" onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Specialization</label>
          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <label>Qualification</label>
          <input
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          />

          <label>Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />

          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <div className="profile-actions">
            <button type="submit">Save</button>
            <button
              type="button"
              className="cancel"
              onClick={() => navigate("/doctor/profile")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default DoctorProfileEdit;
