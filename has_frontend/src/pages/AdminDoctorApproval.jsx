import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDoctorApproval.css";

const AdminDoctorApproval = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔔 LOGIN-STYLE ALERT */
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { showAlert: globalShowAlert } = useAlert();

  const navigate = useNavigate();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type });
    }, 3000);
    globalShowAlert?.(message, type);
  };

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await api.get("/api/admin/pending-doctors/");
        setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
        showAlert("Failed to load doctors ❌", "error");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const pendingDoctors = doctors.filter((d) => {
    // backend `pending_doctors` already returns only waiting doctors
    // the response doesn't include `is_approved`, so just pass through
    return true;
  });

  if (loading) return <div className="page-loader">Loading...</div>;

  return (
    <div className="admin-approval-page">

      {/* 🔔 LOGIN PAGE ALERT */}
      {alert.show && (
        <div className={`login-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h1>Pending Doctor Approvals</h1>

      {pendingDoctors.length === 0 ? (
        <p className="empty-text">No pending doctors</p>
      ) : (
        <div className="doctor-grid">
          {pendingDoctors.map((doc) => (
            <div
              key={doc.id}
              className="doctor-card"
              onClick={() => navigate(`/admin/doctor/${doc.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={doc.photo || "/default-doctor.png"}
                alt={doc.name}
                onError={(e) => (e.target.src = "/default-doctor.png")}
              />

              <h3>Dr. {doc.name}</h3>
              <p>{doc.specialization}</p>
              <p>{doc.experience} years</p>
              <p className="status">Status: Waiting</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDoctorApproval;
