import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import style from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={style.footerContainer}>
      <div className={style.footerGlow}></div>
      <div className={style.footerContentContainer}>
        <div className={style.footerLeft}>
          <div className={style.footerBrand}>
            <img src={logo} alt="Eat Word logo" />
            <p>Elevate Your Language</p>
          </div>
          <div className={style.desktopCopyright}>
            <p>© 2024 Eat Word. All Rights Reserved.</p>
          </div>
        </div>

        <div className={style.footerRight}>
          <div className={style.footerSocials}>
            <Link
              to="/"
              aria-label="Twitter"
              className="fa-brands fa-x-twitter"
            />
            <Link
              to="/"
              aria-label="LinkedIn"
              className="fa-brands fa-linkedin"
            />
          </div>

          <nav className={style.footerImportantLinks}>
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
