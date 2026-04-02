import "./About.css";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaUserMd,
  FaShieldAlt,
  FaCalendarCheck,
} from "react-icons/fa";

/* ANIMATION VARIANTS */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const AboutUs = () => {
  return (
    <div className="about-page">

      {/* HERO SECTION */}
      <motion.section
        className="about-hero"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1>About Our Healthcare Platform</h1>
        <p>
          A smart, secure, and user-friendly healthcare appointment system
          connecting patients and doctors effortlessly.
        </p>
      </motion.section>

      {/* MISSION & VISION */}
      <motion.section
        className="about-cards"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="about-card" variants={scaleUp}>
          <FaHeartbeat className="about-icon red" />
          <h2>Our Mission</h2>
          <p>
            To simplify healthcare access by enabling quick appointment booking
            and secure digital medical records.
          </p>
        </motion.div>

        <motion.div className="about-card" variants={scaleUp}>
          <FaUserMd className="about-icon green" />
          <h2>Our Vision</h2>
          <p>
            To build a trusted digital healthcare ecosystem that empowers
            patients and doctors worldwide.
          </p>
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <section className="about-features">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          What Makes Us Different
        </motion.h2>

        <motion.div
          className="feature-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="about-card" variants={scaleUp}>
            <FaCalendarCheck />
            <h3>Easy Appointments</h3>
            <p>Book doctor appointments in just a few clicks.</p>
          </motion.div>

          <motion.div className="about-card" variants={scaleUp}>
            <FaShieldAlt />
            <h3>Secure Data</h3>
            <p>Your medical information is protected and confidential.</p>
          </motion.div>

          <motion.div className="about-card" variants={scaleUp}>
            <FaUserMd />
            <h3>Verified Doctors</h3>
            <p>Doctors are approved by admins for trust and safety.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CLOSING SECTION */}
      <motion.section
        className="about-footer"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>Built for Better Healthcare</h2>
        <p>
          Our platform is designed with modern technologies to ensure speed,
          security, and a seamless experience for everyone.
        </p>
      </motion.section>

    </div>
  );
};

export default AboutUs;
