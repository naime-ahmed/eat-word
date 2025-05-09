import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaArrowRightToBracket, FaBars, FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import defaultUserProfile from "../../../assets/defaultUserProfileImage.webp";
import logo from "../../../assets/logo.png";
import UserProfile from "../../Popup/PopUpContents/UserProfile/UserProfile";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import Skeleton from "../../ui/loader/Skeleton/Skeleton";
import styles from "./Header.module.css";

const Header = ({ top = "0" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const profileRef = useRef(null);

  const handleProfileToggle = (e) => {
    e.stopPropagation();
    setIsProfileShown((prev) => !prev);
  };

  const handleScroll = () => {
    setIsSticky(window.scrollY > 70);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const computedTop = isSticky ? "0" : top;

  return (
    <header
      className={`${styles.nav} ${isSticky ? styles.sticky : ""} ${
        isSidebarOpen ? styles.active : ""
      }`}
      style={{ top: computedTop }}
    >
      <div className={styles.navBar}>
        <FaBars
          className={`${styles.sidebarOpen}`}
          onClick={handleSidebarToggle}
          aria-label="Toggle Sidebar"
        />
        <span className={`${styles.logo} ${styles.navLogo}`}>
          <Link to="/">
            <img src={logo} alt="Eat Word Logo" width="100px" height="40px" />
          </Link>
          <small>Beta</small>
        </span>
        <div className={`${styles.menu} ${isSidebarOpen ? styles.active : ""}`}>
          <div className={styles.logoToggle}>
            <span className={styles.logo}>
              <Link to="/">
                <img src={logo} alt="Brand logo" />
              </Link>
              <small>Beta</small>
            </span>
            <FaXmark
              className={`${styles.sidebarClose}`}
              onClick={handleSidebarToggle}
              aria-label="Close Sidebar"
            />
          </div>
          <nav aria-label="Main Navigation">
            <ul className={styles.navLinks}>
              <li>
                {isLoading ? (
                  <Skeleton width={"80px"} height={"20px"} />
                ) : (
                  <Link
                    to="/"
                    onClick={handleSidebarToggle}
                    aria-label="Home Page"
                  >
                    Home
                  </Link>
                )}
              </li>
              {isAuthenticated && (
                <li>
                  <Link
                    to="/my-space"
                    onClick={handleSidebarToggle}
                    aria-label="My Space Page"
                  >
                    My Space
                  </Link>
                </li>
              )}
              <li>
                {isLoading ? (
                  <Skeleton width={"80px"} height={"20px"} />
                ) : (
                  <Link
                    to="/price"
                    onClick={handleSidebarToggle}
                    aria-label="Pricing Page"
                  >
                    Pricing
                  </Link>
                )}
              </li>
              <li>
                {isLoading ? (
                  <Skeleton width={"80px"} height={"20px"} />
                ) : (
                  <Link
                    to="/about"
                    onClick={handleSidebarToggle}
                    aria-label="About Page"
                  >
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
                      ref={profileRef}
                      onClick={handleProfileToggle}
                      className={styles.profile}
                      aria-label="User Profile"
                    >
                      <img
                        src={user?.profilePicture || defaultUserProfile}
                        alt="User Profile"
                      />
                    </button>
                    {isProfileShown && (
                      <div className={styles.userProfileContainer}>
                        <UserProfile
                          onClose={() => setIsProfileShown(false)}
                          profileBtnRef={profileRef}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <PrimaryBtn handleClick={() => navigate("/sign-in")}>
                    Sign In <FaArrowRightToBracket />
                  </PrimaryBtn>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  top: PropTypes.string,
};

export default Header;
