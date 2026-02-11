import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./DoctorProfile.css";

const PatientProfileEdit = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    age: "",
  });

  /* ALERT */
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

  /* LOAD PROFILE */
  useEffect(() => {
    if (!loading && user?.id) {
      api
        .get(`/profile/${user.id}/`)
        .then((res) => {
          setFormData({
            name: res.data.name || "",
            phone_number: res.data.phone_number || "",
            age: res.data.age || "",
          });
        })
        .catch(() => showAlert("Failed to load profile ❌", "error"))
        .finally(() => setProfileLoading(false));
    }
  }, [loading, user?.id]);

  if (loading || profileLoading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!user) return null;

  /* CHANGE */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* UPDATE */
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.put(`/profile/update/${user.id}/`, formData);

    showAlert("Profile updated successfully ✅");
    setTimeout(() => navigate("/profile"), 1500);
  } catch (err) {
    showAlert("Update failed ❌", "error");
  }
};

  return (
    <div className="profile-page">

      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="profile-card" style={{marginTop: '80px', marginBottom: '253px'}}>
        <h1>Edit Profile</h1>

        <form className="profile-form" onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <div className="profile-actions">
            <button type="submit">Save</button>
            <button
              type="button"
              className="cancel"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PatientProfileEdit;
