import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./DoctorDailyAppointments.css";

const DoctorDailyAppointments = () => {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);

  /* 🔔 LOGIN-STYLE ALERT */
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

  /* LOAD TODAY APPOINTMENTS */
  const loadAppointments = async () => {
    try {
      const res = await api.get(
        `/doctor/daily-appointments/${user.doctor_id}/`
      );
      setAppointments(res.data);
    } catch {
      showAlert("Failed to load appointments ❌", "error");
    }
  };

  useEffect(() => {
  if (!loading && user?.doctor_id) {
    loadAppointments();
  }
}, [loading, user]);


  /* UPDATE STATUS */
  const updateStatus = async (appointmentId, status) => {
    try {
      await api.put(`/doctor/update-status/${appointmentId}/`, { status });

      setAppointments((prev) =>
        prev.map((app) =>
          app.appointment_id === appointmentId
            ? { ...app, status }
            : app
        )
      );

      showAlert(`Appointment ${status} ✅`);
    } catch {
      showAlert("Failed to update status ❌", "error");
    }
  };

  return (
    <div className="doctor-daily-page">

      {/* 🔔 LOGIN-STYLE ALERT */}
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h1>Today’s Appointments</h1>

      {appointments.length === 0 ? (
        <p className="empty-text">No appointments today</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((app) => (
            <div className="appointment-card" key={app.appointment_id}>
              <div className="info">
                <h3>Token #{app.token_number}</h3>
                <p><b>Patient:</b> {app.patient_name}</p>
                <p>
                  <b>Time:</b> {app.start_time} – {app.end_time}
                </p>
              </div>

              <div className="actions">
                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>

                {app.status === "Pending" && (
                  <div className="btn-group">
                    <button
                      className="complete-btn"
                      onClick={() =>
                        updateStatus(app.appointment_id, "Completed")
                      }
                    >
                      Complete
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() =>
                        updateStatus(app.appointment_id, "Cancelled")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDailyAppointments;
