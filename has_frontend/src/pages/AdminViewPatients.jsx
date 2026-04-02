import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import "./PatientDoctors.css";
import { useAlert } from "../context/AlertContext";

const AdminViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* CONFIRM OVERLAY STATE */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmPatientId, setConfirmPatientId] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const { showAlert } = useAlert();
  const showAlertRef = useRef(showAlert);

  useEffect(() => {
    showAlertRef.current = showAlert;
  }, [showAlert]);

  /* LOAD PATIENTS */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/all-patients/");
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch {
        showAlertRef.current?.("Failed to load patients", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* SEARCH */
  const filteredPatients = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      String(p.name || "").toLowerCase().includes(q) ||
      String(p.email || "").toLowerCase().includes(q) ||
      String(p.phone_number || "").toLowerCase().includes(q) ||
      String(p.gender || "").toLowerCase().includes(q) ||
      String(p.age || "").toLowerCase().includes(q)
    );
  });

  /* OPEN CONFIRM MODAL */
  const openBlockConfirm = (id) => {
    setConfirmPatientId(id);
    setConfirmAction("block");
    setConfirmText("Block this patient? They will be unable to login.");
    setConfirmOpen(true);
  };

  const openUnblockConfirm = (id) => {
    setConfirmPatientId(id);
    setConfirmAction("unblock");
    setConfirmText("Unblock this patient? They will be able to login.");
    setConfirmOpen(true);
  };

  /* CONFIRM ACTION */
  const handleConfirm = async () => {
    if (!confirmPatientId) return;

    try {
      setLoading(true);

      if (confirmAction === "block") {
        await api.put(`/api/admin/block-patient/${confirmPatientId}/`);
        setPatients((prev) =>
          prev.map((p) =>
            p.id === confirmPatientId ? { ...p, is_active: false } : p
          )
        );
        showAlertRef.current?.("Patient blocked successfully", "success");
      }

      if (confirmAction === "unblock") {
        await api.put(`/api/admin/unblock-patient/${confirmPatientId}/`);
        setPatients((prev) =>
          prev.map((p) =>
            p.id === confirmPatientId ? { ...p, is_active: true } : p
          )
        );
        showAlertRef.current?.("Patient unblocked successfully", "success");
      }
    } catch {
      showAlertRef.current?.("Operation failed", "error");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setConfirmPatientId(null);
      setConfirmAction(null);
    }
  };

  return (
    <div className="doctor-page">
      <h1>Admin — All Patients</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by name, email, phone, age, or gender"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{ marginLeft: 50 }}>Loading patients...</p>
      ) : (
        <div className="doctor-grid">
          {filteredPatients.length === 0 ? (
            <p className="empty-text">No patients found</p>
          ) : (
            filteredPatients.map((p) => (
              <div className="doctor-card" key={p.id}>
                <h3>{p.name}</h3>
                <p>Age: {p.age}</p>
                <p>Gender: {p.gender}</p>
                <p>Phone: {p.phone_number}</p>
                <p>Email: {p.email}</p>

                <div style={{ marginTop: 10 }}>
                  {p.is_active === false ? (
                    <button
                      className="unblock-btn"
                      onClick={() => openUnblockConfirm(p.id)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="block-btn"
                      onClick={() => openBlockConfirm(p.id)}
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONFIRM OVERLAY */}
      {confirmOpen && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirm Action</h3>
            <p>{confirmText}</p>

            <div className="confirm-actions">
              <button
                className="cancel"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button className="confirm" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewPatients;
