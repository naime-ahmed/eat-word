import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import style from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={style.footerContainer}>
      <div className={style.footerTop}>
        <div className={style.brand}>
          <img src={logo} alt="your words logo" />
          <p>Eat Word</p>
          <p>Empower Your Vocabulary</p>
        </div>
        <div className={style.quickLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Pricing</Link>
            </li>
            <li>
              <Link to="/">Features</Link>
            </li>
            <li>
              <Link to="/">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className={style.learnMore}>
          <h3>Learn More</h3>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/">FAQ</Link>
            </li>
            <li>
              <Link to="/privacyPolicy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/tac">Terms of Service</Link>
            </li>
          </ul>
        </div>
        <div className={style.contactInfo}>
          <h3>Contact Us</h3>
          <p>
            Email:
            <Link className={style.email} to="mailto:naime2molla@gmail.com">
              support@eatword.com
            </Link>
          </p>
          <p>Phone: +8801926537994</p>
          <p>Address: 2^#, Orion, Mars</p>
        </div>
      </div>
      <div className={style.copyright}>
        <p>© 2024 Your Words. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
