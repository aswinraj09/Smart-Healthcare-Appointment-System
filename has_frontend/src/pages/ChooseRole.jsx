import { useNavigate } from "react-router-dom";
import { FaUserInjured, FaUserMd } from "react-icons/fa";
import "./ChooseRole.css";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="role-container">
      <h1>Select Your Role</h1>

      <div className="role-cards">
        {/* Patient Card */}
        <div
          className="role-card"
          onClick={() => navigate("/user-login")}
        >
          <FaUserInjured className="role-icon patient-icon" />
          <h2>Patient</h2>
          <p>Book appointments & manage your health</p>
        </div>

        {/* Doctor Card */}
        <div
          className="role-card"
          onClick={() => navigate("/doctor-login")}
        >
          <FaUserMd className="role-icon doctor-icon" />
          <h2>Doctor</h2>
          <p>Manage appointments & patient records</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
