import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";
import { useAlert } from "../context/AlertContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: "",
    patients: "",
    appointments: "",
    pending_doctors: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type }), 3000);
    globalShowAlert?.(message, type);
  };

  useEffect(() => {
    api
      .get("/api/admin/dashboard/")
      .then((res) => {
        setStats(res.data.stats || {});
        setAppointments(res.data.recent_appointments || []);
      })
      .catch((err) => {
        console.error("ADMIN DASHBOARD ERROR:", err);
        showAlert("Failed to load admin dashboard", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-loader">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>{alert.message}</div>
      )}
      <h1>Admin Dashboard</h1>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p>{stats.doctors}</p>
        </div>

        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>{stats.patients}</p>
        </div>

        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{stats.appointments}</p>
        </div>

        <div className="stat-card pending">
          <h3>Pending Doctors</h3>
          <p>{stats.pending_doctors}</p>
        </div>
      </div>

      {/* RECENT APPOINTMENTS */}
      <div className="recent-section">
        <h2>Recent Appointments</h2>

        {appointments.length === 0 ? (
          <p className="empty-text">No recent appointments</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Token Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={i}>
                  <td>{a.doctor}</td>
                  <td>{a.patient}</td>
                  <td>{a.date}</td>
                  <td>
                    {a.start_time} – {a.end_time}
                  </td>
                  <td>{a.token_number}</td>
                  <td className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
