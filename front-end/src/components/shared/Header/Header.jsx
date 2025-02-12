import { useEffect, useState } from "react";
import { FaArrowRightToBracket, FaBars, FaXmark } from "react-icons/fa6";

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import defaultUserProfile from "../../../assets/defaultUserProfileImage.png";
import logo from "../../../assets/logo.png";
import Popup from "../../Popup/Popup";
import UserProfile from "../../Popup/PopUpContents/UserProfile/UserProfile";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import Skeleton from "../../ui/loader/Skeleton/Skeleton";
import styles from "./Header.module.css";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileOpen = (e) => {
    e.stopPropagation();
    let x = e.clientX + window.scrollX + 16;
    let y = -4;
    if (window.innerWidth < 500) {
      console.log(window.innerWidth);
      x += 100;
    }
    setClickPosition({ x, y: -4 });
    setIsProfileShown(true);
    console.log(x, y);
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
    <header
      className={`${styles.nav} ${isSticky ? styles.sticky : ""} ${
        isSidebarOpen ? styles.active : ""
      }`}
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
        </span>
        <div className={`${styles.menu} ${isSidebarOpen ? styles.active : ""}`}>
          <div className={styles.logoToggle}>
            <span className={styles.logo}>
              <Link to="/">
                <img src={logo} alt="Brand logo" />
              </Link>
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
                      onClick={handleProfileOpen}
                      className={styles.profile}
                      aria-label="User Profile"
                    >
                      <img
                        src={user?.profilePicture || defaultUserProfile}
                        alt="User Profile"
                      />
                    </button>
                  </>
                ) : (
                  <PrimaryBtn handleClick={() => navigate("/sign-in")}>
                    Sign In <FaArrowRightToBracket />
                  </PrimaryBtn>
                )}
              </li>
            </ul>
          </nav>
          {isProfileShown && (
            <Popup
              isOpen={isProfileShown}
              onClose={() => setIsProfileShown(false)}
              showCloseButton={false}
              popupType="menu"
              clickPosition={clickPosition}
            >
              <UserProfile onClose={() => setIsProfileShown(false)} />
            </Popup>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
