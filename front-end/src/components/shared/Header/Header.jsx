import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import styles from "./Header.module.css";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${styles.nav} ${isSticky ? styles.sticky : ""} ${
        isSidebarOpen ? styles.active : ""
      }`}
    >
      <div className={styles.navBar}>
        <i
          className={`fa-solid fa-bars ${styles.sidebarOpen}`}
          onClick={handleSidebarToggle}
        ></i>
        <span className={`${styles.logo} ${styles.navLogo}`}>
          <Link to="/">
            <img src={logo} alt="Brand logo" />
          </Link>
        </span>

        <div className={`${styles.menu} ${isSidebarOpen ? styles.active : ""}`}>
          <div className={styles.logoToggle}>
            <span className={styles.logo}>
              <Link to="/">
                <img src={logo} alt="Brand logo" />
              </Link>
            </span>
            <i
              className={`fa-solid fa-xmark ${styles.sidebarClose}`}
              onClick={handleSidebarToggle}
            ></i>
          </div>

          <ul className={styles.navLinks}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/myspace">My Space</Link>
            </li>
            <li>
              <Link to="/magic">Magic Tools</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
