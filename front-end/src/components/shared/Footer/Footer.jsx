import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Footer.module.css";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Function to update state based on window size
  const handleResize = () => {
    setIsMobile(window.innerWidth < 600);
  };

  // Set up resize event listener
  useEffect(() => {
    handleResize(); // Check initial size on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up listener
    };
  }, []);

  return (
    <div className={style.footerContainer}>
      <div className={style.footerContentContainer}>
        <div className={style.footerLeft}>
          <div className={style.footerBrand}>
            <h1>Eat Word</h1>
            <p>Empower Your Language</p>
          </div>
          {!isMobile && (
            <div className={style.copyrightText}>
              <p>© 2024 Eat Word. All Rights Reserved.</p>
            </div>
          )}
        </div>
        <div className={style.footerRight}>
          <div className={style.footerSocials}>
            <Link>
              <Link to="/" className="fa-brands fa-x-twitter"></Link>
            </Link>
            <Link>
              <Link to="/" className="fa-brands fa-linkedin"></Link>
            </Link>
          </div>
          <div className={style.footerImportantLinks}>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacyPolicy">Privacy Policy</Link>
          </div>
          {isMobile && (
            <div className={style.copyrightText}>
              <p>© 2024 Eat Word. All Rights Reserved.</p>
            </div>
          )}
        </div>
      </div>

      <div className={style.footerGlow}></div>
    </div>
  );
};

export default Footer;
