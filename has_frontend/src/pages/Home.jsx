import "./Home.css";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, scaleUp } from "../animations/scrollAnimations";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaUserInjured,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

/* STAGGER */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* HERO */}
      <motion.section
        className="hero-section"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <h1>Smart Healthcare Appointment System</h1>
        <p>
          A modern platform to connect patients with verified doctors and manage
          healthcare appointments easily.
        </p>
        <button style={{color : '#00a1b0'}} className="primary-btn" onClick={() => navigate("/login")}>
          Login Now
        </button>
      </motion.section>

      {/* GET STARTED */}
      <motion.section
        className="section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="section-title">Get Started In Minutes</h2>

        <motion.div
          className="card-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="step-card" variants={scaleUp}>
            <FaUserInjured />
            <h3>Patient</h3>
            <p>Register, search doctors, and book appointments easily.</p>
          </motion.div>

          <motion.div className="step-card" variants={scaleUp}>
            <FaUserMd />
            <h3>Doctor</h3>
            <p>Manage availability, appointments, and consultations.</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* WHY CHOOSE US */}
      <section className="section light">
        <motion.h2
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Why Choose Smart Healthcare?
        </motion.h2>

        <motion.div
          className="card-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="info-card" variants={scaleUp}>
            <FaShieldAlt />
            <h4>Secure Platform</h4>
            <p>Role-based access ensures data security.</p>
          </motion.div>

          <motion.div className="info-card" variants={scaleUp}>
            <FaClock />
            <h4>Save Time</h4>
            <p>No waiting lines. Book appointments instantly.</p>
          </motion.div>

          <motion.div className="info-card" variants={scaleUp}>
            <FaUserMd />
            <h4>Verified Doctors</h4>
            <p>All doctors are approved by admin before access.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <motion.section
        className="section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="section-title">Powerful Features</h2>

        <motion.div
          className="feature-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="feature-card" variants={scaleUp}>
            Online Appointment Booking
          </motion.div>

          <motion.div className="feature-card" variants={scaleUp}>
            Doctor Availability Management
          </motion.div>

          <motion.div className="feature-card" variants={scaleUp}>
            Medical Records Tracking
          </motion.div>
        </motion.div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        className="section light"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="section-title">How It Works</h2>

        <motion.div
          className="timeline"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="timeline-card" variants={scaleUp}>
            <span>1</span>
            <p>Create an account</p>
          </motion.div>

          <FaArrowRight />

          <motion.div className="timeline-card" variants={scaleUp}>
            <span>2</span>
            <p>Choose doctor</p>
          </motion.div>

          <FaArrowRight />

          <motion.div className="timeline-card" variants={scaleUp}>
            <span>3</span>
            <p>Book appointment</p>
          </motion.div>

          <FaArrowRight />

          <motion.div className="timeline-card" variants={scaleUp}>
            <span>4</span>
            <p>Consult & track</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ABOUT */}
      <motion.section
        className="section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="section-title">About Us</h2>
        <p className="about-text">
          Smart Healthcare is designed to modernize healthcare services by
          providing an easy-to-use digital platform that connects patients
          and doctors efficiently and securely.
        </p>
      </motion.section>

    </div>
  );
};

export default Home;
