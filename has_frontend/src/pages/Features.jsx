import "./Features.css";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaShieldAlt,
  FaClipboardList,
  FaUsersCog,
  FaLock,
} from "react-icons/fa";
import { fadeUp, scaleUp } from "../animations/scrollAnimations";

const Features = () => {
  return (
    <div className="features-page">

      {/* HEADER */}
      <motion.section
        className="features-hero"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1>Platform Features</h1>
        <p>
          Everything you need to manage healthcare appointments efficiently,
          securely, and professionally.
        </p>
      </motion.section>

      {/* CORE FEATURES */}
      <section className="section">
        <motion.h2
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Core Features
        </motion.h2>

        <div className="card-grid">
          <motion.div className="feature-card" variants={scaleUp} whileInView="visible" initial="hidden" viewport={{ once: true }}>
            <FaCalendarCheck />
            <h4>Appointment Booking</h4>
            <p>Book and manage appointments easily with real-time availability.</p>
          </motion.div>

          <motion.div className="feature-card" variants={scaleUp} whileInView="visible" initial="hidden" viewport={{ once: true }}>
            <FaClipboardList />
            <h4>Medical Records</h4>
            <p>Store diagnoses, prescriptions, and patient history securely.</p>
          </motion.div>

          <motion.div className="feature-card" variants={scaleUp} whileInView="visible" initial="hidden" viewport={{ once: true }}>
            <FaShieldAlt />
            <h4>Admin Approval</h4>
            <p>Doctors are verified and approved before accessing the platform.</p>
          </motion.div>
        </div>
      </section>

      {/* ROLE BASED FEATURES */}
      <section className="section light">
        <motion.h2 className="section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          Role Based Access
        </motion.h2>

        <div className="card-grid">
          <motion.div className="feature-card" variants={scaleUp} whileInView="visible" initial="hidden" viewport={{ once: true }}>
            <FaUserInjured />
            <h4>Patient</h4>
            <p>Search doctors, book appointments, view medical history.</p>
          </motion.div>

          <motion.div className="feature-card" variants={scaleUp} whileInView="visible" initial="hidden" viewport={{ once: true }}>
            <FaUserMd />
            <h4>Doctor</h4>
            <p>Manage availability, consultations, and patient records.</p>
          </motion.div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="section">
        <motion.h2 className="section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          Security & Reliability
        </motion.h2>

        <div className="security-box">
          <FaLock />
          <p>
            We use role-based access control, secure APIs, and validated data
            handling to ensure complete safety of patient and doctor information.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Features;
