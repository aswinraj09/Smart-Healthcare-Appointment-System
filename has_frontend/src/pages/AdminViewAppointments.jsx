import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import "./PatientAppointment.css";
import { useAlert } from "../context/AlertContext";

const AdminViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const showAlertRef = useRef(showAlert);

  useEffect(() => {
    showAlertRef.current = showAlert;
  }, [showAlert]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/all-appointments/");
        setAppointments(res.data);
      } catch (err) {
        showAlertRef.current?.("Failed to load appointments", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
    // run only once on mount; showAlert is accessed via ref above
  }, []);

  const safe = Array.isArray(appointments) ? appointments : [];

  const filtered = safe.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.doctor_name?.toLowerCase().includes(q) ||
      a.patient_name?.toLowerCase().includes(q) ||
      String(a.token_number || "").toLowerCase().includes(q) ||
      String(a.date || "").toLowerCase().includes(q) ||
      a.status?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!loading && filtered.length === 0 && search.trim() !== "") {
      showAlertRef.current?.("No appointments found", "error");
    }
  }, [filtered.length, loading, search]);

  return (
    <div className="appointments-page">
      <h1>Admin — All Appointments</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by doctor, patient, date, token or status"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{ marginLeft: 50 }}>Loading appointments...</p>
      ) : (
        <div className="appointments-list">
          {filtered.length === 0 ? (
            <p className="empty-text">No appointments found</p>
          ) : (
            filtered.map((app) => (
              <div className="appointment-card" key={app.appointment_id}>
                <div>
                  <h3>Dr. {app.doctor_name}</h3>
                  <p>Patient: {app.patient_name}</p>
                  <p>
                    {app.date} | {app.start_time} – {app.end_time}
                  </p>
                  <p>Token number: {app.token_number}</p>
                </div>

                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminViewAppointments;
