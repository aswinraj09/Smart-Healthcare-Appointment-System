import { useEffect, useState } from "react";
import api from "../services/api";
import "./PatientDoctors.css";
import { useAlert } from "../context/AlertContext";

const AdminViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔔 ALERT (login-style) */
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type });
    }, 3000);
    globalShowAlert?.(message, type);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/all-doctors/");
        setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        showAlert("Failed to load doctors ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const filtered = safeDoctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q) ||
      (d.is_approved || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="doctor-page">

      {/* 🔔 LOGIN-STYLE ALERT */}
      {alert.show && (
        <div className={`login-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h1>Admin — All Doctors</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by name, specialization, or status"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{ marginLeft: 50 }}>Loading doctors...</p>
      ) : (
        <div className="doctor-grid">
          {filtered.length === 0 ? (
            <p className="empty-text">No doctors found</p>
          ) : (
            filtered.map((doc) => (
              <div
                className="doctor-card"
                key={doc.id}
                onClick={() =>
                  (window.location.href = `/admin/doctor/${doc.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src={doc.photo || "/default-doctor.png"}
                  alt={doc.name}
                  className="doctor-img"
                  onError={(e) =>
                    (e.target.src = "/default-doctor.png")
                  }
                />

                <h3>Dr. {doc.name}</h3>
                <p>{doc.specialization}</p>
                <p className="status">Status: {doc.is_approved}</p>

                {doc.rejection_reason && (
                  <p style={{ color: "#c0392b" }}>
                    Reason: {doc.rejection_reason}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminViewDoctors;
