import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./PatientDoctors.css";
import { useAlert } from "../context/AlertContext";

const AdminDoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  /* 🔔 ALERT (same as login) */
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
    globalShowAlert?.(message, type);
  };

  /* LOAD DOCTOR */
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await api.get(`/api/admin/doctor/${id}/`);
        setDoctor(res.data);
      } catch (err) {
        showAlert("Failed to load doctor ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  /* APPROVE */
  const approveDoctor = async () => {
    try {
      await api.put(`/api/admin/approve-doctor/${id}/`);
      showAlert("Doctor approved successfully ✅", "success", 1500);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      showAlert("Approval failed ❌", "error");
    }
  };

  /* REJECT */
  const rejectDoctor = async () => {
    if (!reason.trim()) {
      showAlert("Please enter rejection reason", "error");
      return;
    }

    try {
      await api.put(`/api/admin/reject-doctor/${id}/`, {
        reason,
      });

      showAlert("Doctor rejected successfully ✅", "success", 1500);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      showAlert("Rejection failed ❌", "error");
    }
  };

  if (loading) return <div className="page-loader">Loading...</div>;
  if (!doctor) return <p className="empty-text">Doctor not found</p>;

  return (
    <div className="doctor-page">

      {/* 🔔 ALERT */}
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h1>Doctor Details</h1>

      <div className="doctor-card">

        <img
          src={doctor.photo || "/default-doctor.png"}
          alt={doctor.name}
          className="doctor-img"
          onError={(e) => (e.target.src = "/default-doctor.png")}
        />

        <h3>Dr. {doctor.name}</h3>
        <p><b>Specialization:</b> {doctor.specialization}</p>
        <p><b>Qualification:</b> {doctor.qualification}</p>
        <p><b>Experience:</b> {doctor.experience} years</p>
        <p><b>Gender:</b> {doctor.gender}</p>
        <p><b>Age:</b> {doctor.age}</p>
        <p><b>Phone:</b> {doctor.phone_number}</p>
        <p><b>Email:</b> {doctor.email}</p>

        <p className="status">
          Status: <b>{doctor.is_approved}</b>
        </p>

        {/* ACTION BUTTONS */}
        <div style={{ marginTop: 15 }}>
          <button
            onClick={approveDoctor}
            style={{ marginRight: 10 }}
          >
            Approve
          </button>

          <button
            style={{ backgroundColor: "#c0392b" }}
            onClick={rejectDoctor}
          >
            Reject
          </button>
        </div>

        {/* REJECTION REASON */}
        <div style={{ marginTop: 15 }}>
          <textarea
            placeholder="Enter rejection reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: "100%",
              minHeight: 80,
              padding: 8,
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default AdminDoctorDetails;
