import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./DoctorAvailability.css";

const DoctorAvailabilityHistory = () => {
  const { role, user } = useAuth();

  const [availabilityList, setAvailabilityList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ALL AVAILABILITY ================= */
  useEffect(() => {
    if (role !== "doctor") {
      setLoading(false);
      return;
    }

    const doctorId = user?.doctor_id ?? user?.doctorId ?? user?.id ?? null;

    if (!doctorId) {
      console.warn("DoctorAvailabilityHistory: doctor id not found on user object", user);
      setLoading(false);
      return;
    }

    api
      .get(`/doctor/availability-history/${doctorId}/`)
      .then((res) => {
        setAvailabilityList(res.data);
        setFilteredList(res.data); // default → show all
      })
      .catch((err) => {
        console.error("Failed to load availability", err);
      })
      .finally(() => setLoading(false));
  }, [role, user]);

  /* ================= DATE SEARCH ================= */
  const handleSearch = (date) => {
    setSearchDate(date);

    if (!date) {
      setFilteredList(availabilityList);
      return;
    }

    const filtered = availabilityList.filter(
      (item) => item.date === date
    );

    setFilteredList(filtered);
  };

  return (
    <div className="availability-page">
      <div style={{marginBottom : '168px'}} className="availability-card-box full-width">
        <h1>My Slots History</h1>

        {/* 🔍 SEARCH BAR */}
        <div className="search-bar">
          <label>Search by Date</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchDate && (
            <button style={{width : '70px', marginBottom : '10px'}} onClick={() => handleSearch("")}>
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-text">No availability found</p>
        ) : (
          filteredList.map((item) => (
            <div className="availability-item" key={item.id} style={{display : 'flex', width : '620px', marginLeft : '50px', paddingLeft : '70px'}}>
              <p style={{marginRight : '50px'}}>
                <strong>Date:</strong> {item.date}
              </p>
              <p style={{marginRight : '50px'}}>
                <strong>Time:</strong> {item.start_time} – {item.end_time}
              </p>
              <p style={{marginRight : '50px'}}>
                <strong>Status:</strong>{" "}
                {new Date(`${item.date}T${item.end_time}`) < new Date()
                  ? "Expired"
                  : "Active"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAvailabilityHistory;
