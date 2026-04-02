import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const { user, role, loading } = useAuth();

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);

  /* 🔒 WAIT FOR AUTH */
  useEffect(() => {
    if (loading) return;
    if (!user || role !== "doctor") return;
    const loadDashboard = async () => {
      try {
        const res = await api.get(`/doctor/dashboard/${user.doctor_id}/`);
        setStats(res.data);
      } catch {
        alert("Failed to load dashboard");
      }
    };

    const loadAppointments = async () => {
      try {
        const res = await api.get(`/doctor/appointments/${user.doctor_id}/`);
        setAppointments(res.data);
      } catch {
        alert("Failed to load appointments");
      }
    };

    loadDashboard();
    loadAppointments();
  }, [loading, user, role]);

  /* ⏳ LOADING STATE */
  if (loading) return <p className="loading">Loading...</p>;
  if (!user || role !== "doctor") return null;

  return (
    <div className="doctor-dashboard">

      <h1>Doctor Dashboard</h1>

      {/* STATS */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card patient">Today Patients <br /><span>{stats.today_patients}</span></div>
          <div className="stats-grid-inner">
            <div className="stat-card total">Total Appointments <br /><span>{stats.total_count}</span></div>
            <div className="stat-card completed">Completed <br /><span>{stats.completed_count}</span></div>
            <div className="stat-card cancelled">Cancelled <br /><span>{stats.cancelled_count}</span></div>
            <div className="stat-card pending">Pending <br /><span>{stats.pending_count}</span></div> <br />
          </div>
          <div>
            <div className="stat-card weekly">Weekly Appointments <br /><span>{stats.weekly_appointments}</span></div><br /> 
            <div className="stat-card monthly">Monthly Appointments <br /><span>{stats.monthly_appointments}</span></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
