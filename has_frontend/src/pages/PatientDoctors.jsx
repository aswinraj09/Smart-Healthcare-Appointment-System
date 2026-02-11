import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./PatientDoctors.css";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/patient/doctors/")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Failed to load doctors", err));
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctor-page">
      <h1>Available Doctors</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by specialization (e.g. Cardiologist)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="doctor-grid">
        {filteredDoctors.length === 0 ? (
          <p className="empty-text">No doctors found</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div className="doctor-card" key={doc.id}>
              
              {/* 👨‍⚕️ Doctor Image */}
              <img
                src={doc.photo}
                alt={doc.name}
                className="doctor-img"
                onError={(e) => {
                  e.target.src = "/default-doctor.png";
                }}
              />

              {/* DEBUG (remove later) */}
              {/* <p>{doc.photo}</p> */}

              <h3>Dr. {doc.name}</h3>
              <p>{doc.specialization}</p>

              <button onClick={() => navigate(`/doctor/${doc.id}`)}>
                Book
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientDoctors;
