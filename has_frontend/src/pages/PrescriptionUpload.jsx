import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./UploadForm.css";
import { useAlert } from "../context/AlertContext";

const PrescriptionUpload = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔔 ALERT STATE (same as login) */
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });
  const { showAlert: globalShowAlert } = useAlert();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type });
    }, 3000);
    globalShowAlert?.(message, type);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role !== "patient") {
      showAlert("Only patients can upload prescriptions ❌", "error");
      return;
    }

    if (!file) {
      showAlert("Please select a prescription file ❌", "error");
      return;
    }

    const formData = new FormData();
    formData.append("patient", user.id);
    formData.append("prescription_file", file);
    formData.append("notes", notes);

    try {
      setLoading(true);

      await api.post("/prescriptions/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("Prescription uploaded successfully ✅");

      setFile(null);
      setNotes("");

      // ⏩ redirect after success
      setTimeout(() => {
        navigate("/medical-records");
      }, 1500);

    } catch (err) {
      console.error(err);
      showAlert("Upload failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      {/* 🔔 ALERT */}
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="upload-card">
        <h2>Upload Prescription</h2>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label>Prescription File</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label>Notes</label>
          <textarea
            placeholder="Optional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
