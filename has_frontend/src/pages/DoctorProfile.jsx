import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorProfile.css";

const DoctorProfileView = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!loading && user?.doctor_id) {
      api
        .get(`/doctor/profile/${user.doctor_id}/`)
        .then((res) => setDoctor(res.data));
    }
  }, [loading, user?.doctor_id]);

  if (!doctor) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h1>Profile</h1>

        <img
          src={
            doctor.photo
              ? `${doctor.photo}?t=${Date.now()}`
              : "/default-doctor.png"
          }
          alt="Doctor"
          className="profile-img"
        />
       
        <h2>Dr. {doctor.name}</h2>
        <p><b>Email:</b> {doctor.email}</p>
        <p><b>Specialization:</b> {doctor.specialization}</p>
        <p><b>Qualification:</b> {doctor.qualification}</p>
        <p><b>Experience:</b> {doctor.experience} years</p>

        <button
          className="edit-btn"
          onClick={() => navigate("/doctor/profile/edit")}
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
};

export default DoctorProfileView;
