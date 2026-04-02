import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./PatientDoctors.css";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/patient/doctors/");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="doctor-page">
      <h1>All Doctors</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by name or specialization"
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
              <div className="doctor-card" key={doc.id}>
                <img
                  src={doc.photo || "/default-doctor.png"}
                  alt={doc.name}
                  className="doctor-img"
                  onError={(e) => (e.target.src = "/default-doctor.png")}
                />

                <h3>Dr. {doc.name}</h3>
                <p>{doc.specialization}</p>

                <button onClick={() => navigate(`/doctor/${doc.id}`)}>
                  View
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ViewDoctors;
