import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorLogin from "./pages/DoctorLogin";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import PatientRegister from "./pages/PatientRegister";
import PatientLogin from "./pages/PatientLogin";
import ChooseRole from "./pages/ChooseRole";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUs from "./pages/About";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import RoleNavbar from "./pages/RoleNavbar";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorAvailabilityHistory from "./pages/DoctorAvailabilityHistory";
import PatientDoctors from "./pages/PatientDoctors";
import DoctorDetails from "./pages/DoctorDetails";
import ViewDoctors from "./pages/ViewDoctors";
import PatientAppointments from "./pages/PatientAppointment";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import LabReportUpload from "./pages/LabReportUpload";
import ScanReportUpload from "./pages/ScanReportUpload";
import PatientPrescriptions from "./pages/PatientPrescription";
import PatientScanReports from "./pages/PatientScanReports";
import PatientLabReports from "./pages/PatientLabReports";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointmentHistory from "./pages/DoctorAppointmentHistory";
import DoctorDailyAppointments from "./pages/DoctorDailyAppointments";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorProfileEdit from "./pages/DoctorProfileEdit";
import PatientProfile from "./pages/PatientProfile";
import PatientProfileEdit from "./pages/PatientProfileEdit";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctorApproval from "./pages/AdminDoctorApproval";
import AdminViewDoctors from "./pages/AdminViewDoctors";
import AdminDoctorDetails from "./pages/AdminDoctorDetails";
import AdminViewPatients from "./pages/AdminViewPatients";
import AdminViewAppointments from "./pages/AdminViewAppointments";
import AuthAlert from "./components/AuthAlert";
import { AlertProvider } from "./context/AlertContext";

function App() {
  return (
    <>
    <BrowserRouter>
      <AlertProvider>
        <AuthAlert />
        <Navbar />
        <RoleNavbar />
      <div style={{ marginTop: "65px"}}></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/user-register" element={<PatientRegister />} />
        <Route path="/user-login" element={<PatientLogin />} />
        <Route path="/login" element={<ChooseRole />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/doctor/set-slot" element={<DoctorAvailability />} />
        <Route path="/doctor/slots-history" element={<DoctorAvailabilityHistory />} />
        <Route path="/doctors" element={<PatientDoctors />} />
        <Route path="/view-doctors" element={<ViewDoctors />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/appointments/:id" element={<PatientAppointments />} />
        <Route path="/medical-records" element={<PatientMedicalRecords />} />
        <Route path="/prescriptions" element={<PrescriptionUpload />} />
        <Route path="/lab-reports" element={<LabReportUpload />} />
        <Route path="/scan-reports" element={<ScanReportUpload />} />
        <Route path="/view-prescriptions" element={<PatientPrescriptions />} />
        <Route path="/view-scan-reports" element={<PatientScanReports />} />
        <Route path="/view-lab-reports" element={<PatientLabReports />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments-history" element={<DoctorAppointmentHistory />} />
        <Route path="/doctor-daily-appointments" element={<DoctorDailyAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/profile/edit" element={<DoctorProfileEdit />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/profile/edit" element={<PatientProfileEdit />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctor-approvals" element={<AdminDoctorApproval />} />
        <Route path="/admin/view-doctors" element={<AdminViewDoctors />} />
        <Route path="/admin/view-patients" element={<AdminViewPatients />} />
        <Route path="/admin/view-appointments" element={<AdminViewAppointments />} />
        <Route path="/admin/doctor/:id" element={<AdminDoctorDetails />} />
      </Routes>
        <Footer />
      </AlertProvider>
    </BrowserRouter>
  </>
  )
}

export default App
