import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./UploadForm.css";

const LabReportUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState("");
  const [file, setFile] = useState(null);
  const [date, setDate] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportType || !file || !date) {
      showAlert("All fields are required ❌", "error");
      return;
    }

    const formData = new FormData();
    formData.append("patient", user.id);
    formData.append("report_type", reportType);
    formData.append("report_file", file);
    formData.append("report_date", date);

    try {
      await api.post("/lab-reports/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showAlert("Lab report uploaded successfully ✅");

      // ⏳ Navigate after alert
      setTimeout(() => {
        navigate("/medical-records");
      }, 1500);

      // reset form
      setReportType("");
      setFile(null);
      setDate("");

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
        <h2>Upload Lab Report</h2>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label>Report Type</label>
          <select
            value={reportType}
            required
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select Report Type</option>
            <option value="BP">Blood Pressure</option>
            <option value="SUGAR">Blood Sugar</option>
            <option value="BLOOD">Blood Test</option>
            <option value="URINE">Urine Test</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Report Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Upload File</label>
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default LabReportUpload;
