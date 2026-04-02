import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type });
    }, 3000);
  };

  useEffect(() => {
  const savedRole = localStorage.getItem("role");
  const savedUser = localStorage.getItem("user");

  if (savedRole && savedUser) {
    setRole(savedRole);
    setUser(JSON.parse(savedUser));
  }

  setLoading(false);
}, []);

  /* ---------------- LOGIN ---------------- */
  const login = (userRole, userData) => {
    setRole(userRole);
    setUser(userData);

    localStorage.setItem("role", userRole);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post("/logout/");
    } catch (err) {
      console.error("Logout error", err);
    }

    setRole(null);
    setUser(null);

    localStorage.removeItem("role");
    localStorage.removeItem("user");

  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        login,
        logout,
        loading,
        alert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
