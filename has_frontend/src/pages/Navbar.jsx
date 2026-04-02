import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { role, logout, loading } = useAuth();

  if (loading) return null; // 🚫 prevents flicker

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Smart Healthcare Appointment System</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/aboutus">About Us</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {!role ? (
          <li><Link to="/login">Login / Signup</Link></li>
        ) : (
          <li className="logout-link" onClick={handleLogout} style={{cursor: 'pointer'}}>
            Logout
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
