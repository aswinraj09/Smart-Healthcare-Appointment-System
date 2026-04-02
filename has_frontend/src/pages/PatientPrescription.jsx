import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import "./PatientPrescription.css";

const PatientPrescriptions = () => {
  const { user, role } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);

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

  useEffect(() => {
    if (role !== "patient") {
      return;
    }

    api
      .get(`/prescriptions/${user.id}/`)
      .then((res) => setPrescriptions(res.data))
      .catch(() => showAlert("Failed to load prescriptions ❌", "error"));
  }, [role, user]);

  return (
    <div className="prescription-page">

      {/* 🔔 ALERT */}
      {alert.show && (
        <div className={`admin-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h2 className="page-title">My Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p className="empty-text">No prescriptions uploaded yet</p>
      ) : (
        <div className="prescription-list">
          {prescriptions.map((item) => (
            <div className="prescription-card" key={item.id}>
              <p className="date">
                Date : {new Date(item.uploaded_at).toLocaleDateString()}
              </p>

              {item.notes && (
                <p className="notes">
                  Note :  {item.notes}
                </p>
              )}

              <a
                href={item.prescription_file}
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

export default PatientPrescriptions;
