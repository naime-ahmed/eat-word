import { BsLinkedin, BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import style from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={style.footerContainer} aria-labelledby="footer-heading">
      <div className={style.footerGlow}></div>
      <div className={style.footerContentContainer}>
        <div className={style.footerLeft}>
          <div className={style.footerBrand}>
            <img src={logo} alt="Eat Word logo" width="250px" height="95px" />
            <p>Elevate Your Language</p>
          </div>
          <div className={style.desktopCopyright}>
            <p>© 2024 Eat Word. All Rights Reserved.</p>
          </div>
        </div>

        <div className={style.footerRight}>
          <div className={style.footerSocials}>
            <Link to="/" aria-label="Follow us on Twitter">
              <BsTwitterX />
            </Link>
            <Link to="/" aria-label="Connect with us on LinkedIn">
              <BsLinkedin />
            </Link>
          </div>

          <nav
            className={style.footerImportantLinks}
            aria-label="Important Links"
          >
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacyPolicy">Privacy Policy</Link>
          </nav>

          <div className={style.mobileCopyright}>
            <p>© 2024 Eat Word. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
