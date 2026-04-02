import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./UploadForm.css";

const ScanReportUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scanType, setScanType] = useState("");
  const [file, setFile] = useState(null);
  const [date, setDate] = useState("");

  /* 🔔 ALERT STATE (same as login) */
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scanType || !file || !date) {
      showAlert("All fields are required ❌", "error");
      return;
    }

    const formData = new FormData();
    formData.append("patient", user.id);
    formData.append("scan_type", scanType);
    formData.append("scan_file", file);
    formData.append("scan_date", date);

    try {
      await api.post("/scan-reports/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("Scan report uploaded successfully ✅");

      // ⏳ Navigate after alert
      setTimeout(() => {
        navigate("/medical-records");
      }, 1500);

    } catch (err) {
      console.error(err);
      showAlert("Upload failed ❌", "error");
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
        <h2>Upload Scan Report</h2>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label>Scan Type</label>
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            required
          >
            <option value="">Select Scan Type</option>
            <option value="XRAY">X-Ray</option>
            <option value="MRI">MRI</option>
            <option value="CT">CT Scan</option>
            <option value="ULTRASOUND">Ultrasound</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Scan Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default ScanReportUpload;
