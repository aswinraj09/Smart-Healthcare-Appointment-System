import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuthAlert = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e) => {
      setMessage(e?.detail?.message || "Please login to continue");
      setShow(true);
    };

    window.addEventListener("unauthenticated", handler);
    return () => window.removeEventListener("unauthenticated", handler);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "#f8d7da",
      color: "#721c24",
      padding: "12px 20px",
      zIndex: 9999,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div>{message}</div>
      <div>
        <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
        <button onClick={() => setShow(false)}>Dismiss</button>
      </div>
    </div>
  );
};

export default AuthAlert;
