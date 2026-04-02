import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./PatientPrescription.css";

const PatientLabReports = () => {
  const auth = useAuth(); // ✅ DO NOT destructure
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔐 HARD GUARD
    if (!auth || auth.loading || !auth.user) return;

    const patientId = auth.user.id;

    api
      .get(`/lab-reports/${patientId}/`)
      .then((res) => setReports(res.data))
      .catch(() => alert("Failed to load lab reports ❌"))
      .finally(() => setLoading(false));

  }, [auth.loading, auth.user]);

  // 🔐 FINAL RENDER GUARD
  if (!auth || auth.loading || loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="prescription-page">
      <h2 className="page-title">My Lab Reports</h2>

      {reports.length === 0 ? (
        <p className="empty-text">No lab reports uploaded</p>
      ) : (
        <div className="prescription-list">
          {reports.map((report) => (
            <div className="prescription-card" key={report.id}>
              <p><b>Report Type:</b> {report.report_type}</p>
              <p><b>Report Date:</b> {report.report_date}</p>

              <a
                href={report.report_file}
                target="_blank"
                rel="noopener noreferrer"
                className="view-btn"
              >
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientLabReports;
