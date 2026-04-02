import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./PatientPrescription.css";

const PatientScanReports = () => {
  const auth = useAuth(); // 👈 DO NOT destructure directly
  const [reports, setReports] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // 🔐 HARD GUARD (this prevents ALL crashes)
    if (!auth || auth.loading || !auth.user) return;

    const patientId = auth.user.id;

    api
      .get(`/scan-reports/${patientId}/`)
      .then((res) => setReports(res.data))
      .catch(() => alert("Failed to load scan reports ❌"))
      .finally(() => setPageLoading(false));

  }, [auth.loading, auth.user]);

  // 🔐 FINAL RENDER GUARD
  if (!auth || auth.loading || !auth.user || pageLoading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="prescription-page">
      <h2 className="page-title">My Scan Reports</h2>

      {reports.length === 0 ? (
        <p className="empty-text">No scan reports uploaded</p>
      ) : (
        <div className="prescription-list">
          {reports.map((report) => (
            <div className="prescription-card" key={report.id}>
              <p><b>Scan Type:</b> {report.scan_type}</p>
              <p><b>Date:</b> {report.scan_date}</p>

              <a
                href={report.scan_file}
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

export default PatientScanReports;
