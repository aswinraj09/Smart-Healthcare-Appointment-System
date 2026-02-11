import React, { createContext, useContext, useState, useCallback } from "react";
import "./Alert.css";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = useCallback((message, type = "success", duration = 3000) => {
    setAlert({ show: true, message, type });
    if (duration > 0) {
      setTimeout(() => {
        setAlert((s) => ({ ...s, show: false }));
      }, duration);
    }
  }, []);

  const hideAlert = useCallback(() => setAlert((s) => ({ ...s, show: false })), []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}

      {/* Global alert UI */}
      {alert.show && (
        <div style={{
          position: "fixed",
          top: 80,
          left: 620,
          zIndex: 9999,
          padding: alert.type === "welcome" ? "16px 20px" : "12px 18px",
          borderRadius: 10,
          color: "#fff",
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: "auto",
          background: (
            alert.type === "error"
              ? "#1e9aa3"
              : alert.type === "welcome"
              ? "linear-gradient(90deg,#1e9aa3,#1e9aa3)"
              : "#1e9aa3"
          ),
          animation: "slideIn 0.3s ease forwards",
        }}>
          {alert.type === "welcome" ? (
            <div style={{
              width: 36,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>👋</div>
          ) : null}
          <div style={{ fontSize: alert.type === "welcome" ? 15 : 14 }}>{alert.message}</div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export default AlertContext;
