import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
                <Link to="/my-space" onClick={handleSidebarToggle}>
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
                    onClick={handleProfileOpen}
                    className={styles.profile}
                  >
                    <img
                      src={user?.profilePicture || defaultUserProfile}
                      alt="user profile picture"
                    />
                  </button>
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
                </>
              ) : (
                <PrimaryBtn handleClick={handleSidebarToggle}>
                  <Link to="/sign-in">
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
