import { useNavigate } from "react-router-dom";
import "./PatientMedicalRecords.css";
import { FaNotesMedical, FaFlask, FaXRay } from "react-icons/fa";

const PatientMedicalRecords = () => {
  const navigate = useNavigate();

  return (
    <div className="records-page">
      
      <h1 className="page-title">My Medical Records</h1>

      <div className="records-grid">

        {/* PRESCRIPTIONS */}
        <div
          className="record-card"
          onClick={() => navigate("/view-prescriptions")}
        >
          <FaNotesMedical className="record-icon" />
          <h3>Prescriptions</h3>
        </div>

        {/* LAB REPORTS */}
        <div
          className="record-card"
          onClick={() => navigate("/view-lab-reports")}
        >
          <FaFlask className="record-icon" />
          <h3>Lab Reports</h3>
        </div>

        {/* SCAN REPORTS */}
        <div
          className="record-card"
          onClick={() => navigate("/view-scan-reports")}
        >
          <FaXRay className="record-icon" />
          <h3>Scan Reports</h3>
        </div>

      </div>


      <h1 className="page-title">Upload Medical Records</h1>

      <div className="records-grid">

        {/* PRESCRIPTIONS */}
        <div
          className="record-card"
          onClick={() => navigate("/prescriptions")}
        >
          <FaNotesMedical className="record-icon" />
          <h3>Prescriptions</h3>
          <p>Doctor prescribed medicines</p>
        </div>

        {/* LAB REPORTS */}
        <div
          className="record-card"
          onClick={() => navigate("/lab-reports")}
        >
          <FaFlask className="record-icon" />
          <h3>Lab Reports</h3>
          <p>Blood pressure, sugar & lab tests</p>
        </div>

        {/* SCAN REPORTS */}
        <div
          className="record-card"
          onClick={() => navigate("/scan-reports")}
        >
          <FaXRay className="record-icon" />
          <h3>Scan Reports</h3>
          <p>X-Ray, MRI, CT scan reports</p>
        </div>

      </div>
    </div>
  );
};

export default PatientMedicalRecords;
