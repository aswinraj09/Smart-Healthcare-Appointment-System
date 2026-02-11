import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>Smart Healthcare Appointment System</h3>
          <p>Book doctor appointments easily and securely.</p>
        </div>

        <div className="footer-center">
          <h4>Quick Links</h4>
          <div className="footer-center-div">
            <ul>
               <li>Home</li>
               <li>About</li>
               <li>Features</li>
               <li>Terms & Conditions</li>
               <li>Login</li> 
           </ul>
           <ul>
               <li>Home</li>
               <li>About</li>
               <li>Features</li>
               <li>Terms & Conditions</li>
               <li>Login</li> 
           </ul>
          </div>
        </div>

        <div className="footer-right">
          <h4>Contact</h4>
          <p>Email: support@smarthealthcare.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Smart Healthcare Appointment System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
