import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./DoctorDetails.css";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type }), 3000);
    globalShowAlert?.(message, type);
  };

  /* LOAD AVAILABILITY */
  const loadAvailability = async () => {
    try {
      const res = await api.get(`/get-availability/${id}/`);
      const now = new Date();

      const upcoming = res.data.filter(slot => {
        const slotTime = new Date(`${slot.date}T${slot.end_time}`);
        return slotTime > now;
      });

      setAvailability(upcoming);
    } catch {
      showAlert("Failed to load availability", "error");
    }
  };

  /* LOAD DATA */
  useEffect(() => {
    api.get(`/doctor/${id}/`)
      .then(res => setDoctor(res.data))
      .catch(() => showAlert("Failed to load doctor", "error"));

    loadAvailability();
  }, [id]);

  /* BOOK */
  const handleConfirmBooking = async () => {
  if (role !== "patient") {
    showAlert("Please login as patient", "error");
    return;
  }

  try {
    const res = await api.post("/book/", {
      doctor_id: id,
      availability_id: selectedSlot.id,
      patient_id: user.id
    });

    showAlert(`Appointment booked ✅ Token No: ${res.data.token_number}`);

    setConfirmOpen(false);
    loadAvailability(); // refresh remaining slots

  } catch (err) {
    if (err.response?.status === 409) {
      showAlert(err.response.data.message, "error");
    } else {
      showAlert("Booking failed ❌", "error");
    }
  }
};

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="doctor-details-page">

      {alert.show && <div className={`admin-alert ${alert.type}`}>{alert.message}</div>}

      <div className="doctor-info-card">
        <h1>Doctor Details</h1>
        <img
          src={doctor.photo}
          alt={doctor.name}
          onError={(e) => e.target.src = "/default-doctor.png"}
        />
        <h2>Dr. {doctor.name}</h2>
        <p><b>Specialization:</b> {doctor.specialization}</p>
        <p><b>Qualification:</b> {doctor.qualification}</p>
        <p><b>Experience:</b> {doctor.experience} years</p>
      </div>

      <div className="availability-section">
        <h1>Available Slots</h1>

        {availability.length === 0 ? (
          <p>No available slots</p>
        ) : (
          availability.map(slot => (
            <div key={slot.id} className={`slot-card ${slot.is_full ? "full" : ""}`}>
              <p><b>{slot.date}</b></p>
              <p>{slot.start_time} – {slot.end_time}</p>
              <p>Remaining Slots: <b>{slot.remaining_slots}</b></p>

              <button
                disabled={slot.is_full}
                onClick={() => {
                  setSelectedSlot(slot);
                  setConfirmOpen(true);
                }}
              >
                {slot.is_full ? "Slot Full" : "Book Appointment"}
              </button>
            </div>
          ))
        )}
      </div>

      {confirmOpen && selectedSlot && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirm Appointment</h3>
            <p>
              Dr. {doctor.name}<br />
              {selectedSlot.date} ({selectedSlot.start_time} – {selectedSlot.end_time})
            </p>
            <div className="confirm-actions">
              <button onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button onClick={handleConfirmBooking}>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDetails;
