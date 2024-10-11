import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import defaultUserProfile from "../../../assets/defaultUserProfileImage.png";
import logo from "../../../assets/logo.png";
import UserProfile from "../../popups/UserProfile/UserProfile";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import Skeleton from "../../ui/loader/Skeleton/Skeleton";
import styles from "./Header.module.css";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const profileRef = useRef(null);
  const profilePicBtnRef = useRef(null);

  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  console.log(isAuthenticated, user);
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

  // Detect clicks outside the profile card to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        profilePicBtnRef.current &&
        !profilePicBtnRef.current.contains(event.target) &&
        isProfileShown
      ) {
        setIsProfileShown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileShown]);

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
              {isLoading ? (
                <Skeleton width={"80px"} height={"20px"} />
              ) : (
                <Link to="/" onClick={handleSidebarToggle}>
                  Home
                </Link>
              )}
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/myspace" onClick={handleSidebarToggle}>
                  My Space
                </Link>
              </li>
            )}
            <li>
              {isLoading ? (
                <Skeleton width={"80px"} height={"20px"} />
              ) : (
                <Link to="/price" onClick={handleSidebarToggle}>
                  Pricing
                </Link>
              )}
            </li>
            <li>
              {isLoading ? (
                <Skeleton width={"80px"} height={"20px"} />
              ) : (
                <Link to="/about" onClick={handleSidebarToggle}>
                  About
                </Link>
              )}
            </li>
            <li>
              {isLoading ? (
                <Skeleton width={"80px"} height={"20px"} />
              ) : isAuthenticated ? (
                <>
                  <button
                    ref={profilePicBtnRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileShown((prev) => !prev);
                    }}
                    className={styles.profile}
                  >
                    <img src={defaultUserProfile} alt="user profile picture" />
                  </button>
                  {isProfileShown && (
                    <div ref={profileRef}>
                      <UserProfile onClose={() => setIsProfileShown(false)} />
                    </div>
                  )}
                </>
              ) : (
                <PrimaryBtn handleClick={handleSidebarToggle}>
                  <Link to="/signIn">
                    Sign In{" "}
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  </Link>
                </PrimaryBtn>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
