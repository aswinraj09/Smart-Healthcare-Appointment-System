import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorProfile.css";

const PatientProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user?.id) {
      navigate("/login"); // 🔒 safety redirect
      return;
    }

    api
      .get(`/profile/${user.id}/`)
      .then((res) => {
        setPatient(res.data);
      })
      .catch((err) => {
        console.error("PROFILE ERROR:", err);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [loading, user?.id, navigate]);

  if (loading || pageLoading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!patient) {
    return <p>No profile data found</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card" style={{marginTop: '80px', marginBottom: '315px'}}>
        <h1>Profile</h1>

        <p><b>Name: </b>{patient.name}</p>
        <p><b>Email:</b> {patient.email}</p>
        <p><b>Age:</b> {patient.age}</p>
        <p><b>Phone:</b> {patient.phone_number}</p>

        <button
          className="edit-btn"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
};

export default PatientProfile;
