import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorAppointmentHistory.css";

const DoctorAppointmentHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    if (!user?.doctor_id) return;

    api
      .get(`/doctor/appointments/${user.doctor_id}/`)
      .then((res) => setAppointments(res.data))
      .catch(() => alert("Failed to load appointments"));
  }, [user]);

  /* 🔍 FILTER LOGIC */
  const filteredAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    const today = new Date();

    // 📅 DATE SEARCH
    if (searchDate && app.date !== searchDate) {
      return false;
    }

    // 📆 WEEKLY
    if (filter === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return appDate >= weekAgo && appDate <= today;
    }

    // 🗓 MONTHLY
    if (filter === "monthly") {
      return (
        appDate.getMonth() === today.getMonth() &&
        appDate.getFullYear() === today.getFullYear()
      );
    }

    return true; // ALL
  });

  return (
    <div className="doctor-history-page">
      <h1>Appointment History</h1>

      {/* 🔍 SEARCH & FILTER */}
        <div className="date-search-wrapper">
        <input
           type="date"
           value={searchDate}
           onChange={(e) => setSearchDate(e.target.value)}
        />

        {searchDate && (
            <button
               className="clear-date-btn"
               onClick={() => setSearchDate("")}
               title="Clear date"
               >
            Clear
           </button>
           )}

        <div className="filter-bar">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("weekly")}>Weekly</button>
          <button onClick={() => setFilter("monthly")}>Monthly</button>
        </div>
        </div>

      {/* LIST */}
      {filteredAppointments.length === 0 ? (
        <p className="empty-text">No appointments found</p>
      ) : (
        <div className="history-list">
          {filteredAppointments.map((app) => (
            <div className="history-card" key={app.appointment_id}>
              <div>
                <h3>{app.patient_name}</h3>
                <p>
                  {app.date} | {app.start_time} – {app.end_time}
                </p>
                <p>
                  Token No: <b>{app.token_number}</b>
                </p>
              </div>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentHistory;
