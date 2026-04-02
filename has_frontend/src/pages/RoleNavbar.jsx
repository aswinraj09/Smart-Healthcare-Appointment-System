import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RoleNavbar.css";

const RoleNavbar = () => {
  const { role, loading } = useAuth();

  if (loading || !role) return null;

  return (
    <div className="role-navbar">
      {role === "patient" && (
        <>
          <Link to="/doctors">Book Appointment</Link>
          <Link to="/appointments/:id">Appointments History</Link>
          <Link to="/medical-records">Medical Reports</Link>
          <Link to="/profile" style={{marginLeft: '800px', fontSize: '18px', fontWeight: '750'}}>Profile</Link>
        </>
      )}

      {role === "doctor" && (
        <>
          <Link to="/doctor-dashboard">Dashboard</Link>
          <Link to="/doctor-daily-appointments">Daily Appointments</Link>
          <Link to="/doctor/appointments-history">Appointments History</Link>
          <Link to="/doctor/set-slot">Set Slots</Link>
          <Link to="/doctor/slots-history">Slots History</Link>
          <Link to="/doctor/profile" style={{marginLeft: '600px', fontSize: '18px', fontWeight: '750'}}>Profile</Link>
        </>
      )}

      {role === "admin" && (
        <>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/doctor-approvals">Approvals</Link>
          <Link to="/admin/view-doctors">View Doctors</Link>
          <Link to="/admin/view-patients">View Patients</Link>
          <Link to="/admin/view-appointments">View Appointments</Link>
        </>
      )}
    </div>
  );
};

export default RoleNavbar;
