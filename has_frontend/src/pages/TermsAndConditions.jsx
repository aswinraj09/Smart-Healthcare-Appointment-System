import "./Terms.css";

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms & Conditions</h1>

      <p className="updated">Last updated: January 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using this healthcare appointment system, you agree
          to be bound by these Terms and Conditions. If you do not agree, please
          do not use the platform.
        </p>
      </section>

      <section>
        <h2>2. User Accounts</h2>
        <p>
          Users must provide accurate and complete information during
          registration. You are responsible for maintaining the confidentiality
          of your account credentials.
        </p>
      </section>

      <section>
        <h2>3. Doctor & Patient Responsibilities</h2>
        <ul>
          <li>Doctors must provide valid professional information.</li>
          <li>Patients must provide correct personal details.</li>
          <li>Any misuse of the platform may lead to account suspension.</li>
        </ul>
      </section>

      <section>
        <h2>4. Appointments</h2>
        <p>
          Appointment availability depends on doctors’ schedules. The platform
          does not guarantee appointment confirmation.
        </p>
      </section>

      <section>
        <h2>5. Medical Information</h2>
        <p>
          Medical records shared on this platform are confidential. Users are
          responsible for the accuracy of the information they provide.
        </p>
      </section>

      <section>
        <h2>6. Privacy</h2>
        <p>
          Your personal data will be handled securely and will not be shared
          with third parties without consent, except where required by law.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          This platform acts only as a scheduling system and is not responsible
          for medical outcomes or treatment decisions.
        </p>
      </section>

      <section>
        <h2>8. Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms without prior notice.
        </p>
      </section>

      <section>
        <h2>9. Changes to Terms</h2>
        <p>
          These terms may be updated at any time. Continued use of the platform
          implies acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          For any questions regarding these Terms & Conditions, please contact
          the system administrator.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
