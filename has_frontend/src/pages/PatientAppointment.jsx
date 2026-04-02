import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./PatientAppointment.css";

const PatientAppointments = () => {
  const { user, role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type }), 3000);
    globalShowAlert?.(message, type);
  };

  /* LOAD APPOINTMENTS */
  const loadAppointments = async () => {
    try {
      const res = await api.get(
        `/appointments/${user.id}/`
      );
      setAppointments(res.data);
    } catch {
      showAlert("Failed to load appointments", "error");
    }
  };

  useEffect(() => {
    if (role === "patient") loadAppointments();
  }, [role]);

  /* CANCEL */
  const cancelAppointment = async (appointmentId) => {
  try {
    await api.put(`/cancel/${appointmentId}/`);

    showAlert("Appointment cancelled successfully ✅");

    setAppointments((prev) =>
      prev.map((app) =>
        app.appointment_id === appointmentId
          ? { ...app, status: "Cancelled", can_cancel: false }
          : app
      )
    );

  } catch (err) {
    showAlert(
      err.response?.data?.message || "Failed to cancel appointment ❌",
      "error"
    );
  }
};

  return (
    <div className="appointments-page">

      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <p className="empty-text">No appointments found</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((app) => (
  <div className="appointment-card" key={app.appointment_id}>
    <div>
    <h3>Dr. {app.doctor_name}</h3>
    <p>{app.specialization}</p>
    <p>
      {app.date} | {app.start_time} – {app.end_time}
    </p>
    <p>Token number: {app.token_number}</p>
    </div>

    <span className={`status ${app.status.toLowerCase()}`}>
      {app.status}
    </span>

    {app.can_cancel ? (
      <button
        className="cancel-btn"
        style={{width: '200px'}}
        key={app.appointment_id}
onClick={() => cancelAppointment(app.appointment_id)}

      >
        Cancel Appointment
      </button>
    ) : (
      <p className="expired-text">Cannot cancel</p>
    )
    }
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
