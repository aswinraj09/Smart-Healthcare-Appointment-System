import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./DoctorAvailability.css";

const DoctorAvailability = () => {
  const { role, user } = useAuth();

  const [formData, setFormData] = useState({
    id: null,
    date: "",
    start_time: "",
    end_time: "",
  });

  const [availabilityList, setAvailabilityList] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { showAlert: globalShowAlert } = useAlert();

  const today = new Date().toISOString().split("T")[0];

  /* ================= ALERT ================= */
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type }), 3000);
    globalShowAlert?.(message, type);
  };

  /* ================= FILTER UPCOMING ================= */
  const isUpcomingAvailability = (item) => {
    const now = new Date();
    const endDateTime = new Date(`${item.date}T${item.end_time}`);
    return endDateTime > now;
  };

  /* ================= LOAD AVAILABILITY ================= */
  useEffect(() => {
    if (role !== "doctor" || !user?.doctor_id) return;

    api
      .get(`/get-availability/${user.doctor_id}/`)
      .then((res) => {
        const upcoming = res.data.filter(isUpcomingAvailability);
        setAvailabilityList(upcoming);
      })
      .catch(() => showAlert("Failed to load Slots ❌", "error"));
  }, [role, user]);

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.end_time <= formData.start_time) {
      showAlert("End time must be after start time ❌", "error");
      return;
    }

    const selectedEnd = new Date(`${formData.date}T${formData.end_time}`);
    if (selectedEnd <= new Date()) {
      showAlert("Cannot add past time slot ❌", "error");
      return;
    }

    try {
      if (formData.id) {
        // UPDATE
        await api.put(`/update-availability/${formData.id}/`, formData);

        setAvailabilityList((prev) =>
          prev.map((item) =>
            item.id === formData.id ? { ...item, ...formData } : item
          )
        );

        showAlert("Slot updated ✅");
      } else {
        // ADD
        const res = await api.post("/set-availability/", {
          doctor: user.doctor_id,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
        });

        setAvailabilityList((prev) =>
          [...prev, res.data].filter(isUpcomingAvailability)
        );

        showAlert("Slot added ✅");
      }

      resetForm();
    } catch {
      showAlert("Operation failed ❌", "error");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      date: item.date,
      start_time: item.start_time,
      end_time: item.end_time,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/delete-availability/${id}/`);
      setAvailabilityList((prev) => prev.filter((item) => item.id !== id));
      showAlert("Slot deleted ✅");
    } catch {
      showAlert("Failed to delete ❌", "error");
    }
  };

  const resetForm = () => {
    setFormData({ id: null, date: "", start_time: "", end_time: "" });
  };

  return (
    <div className="availability-page">
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="availability-layout" style={{marginBottom : '195px', marginTop : '40px'}}>

        {/* LEFT CARD */}
        <div className="availability-card-box">
          <h1>{formData.id ? "Edit Slot" : "Set Slot"}</h1>

          <form onSubmit={handleSubmit}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />

            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />

            <button type="submit">
              {formData.id ? "Update Slot" : "Save Slot"}
            </button>
          </form>
        </div>

        {/* RIGHT CARD */}
        <div className="availability-card-box">
          <h1>Your Slots</h1>
          <div className="availability-items">
            {availabilityList.length === 0 ? (
              <p>No availability added</p>
            ) : (
              availabilityList.map((item) => (
                <div className="availability-item" key={item.id}>
                  <p><b>{item.date}</b></p>
                  <p>{item.start_time} – {item.end_time}</p>
                  <div className="buttons">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </div>
                </div>
            ))
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
