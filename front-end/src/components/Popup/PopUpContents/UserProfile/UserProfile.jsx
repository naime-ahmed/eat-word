import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { BiLogOut } from "react-icons/bi";
import { RiDashboardFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import defaultUserProfileImage from "../../../../assets/defaultUserProfileImage.webp";
import { setSignOutUser } from "../../../../features/authSlice";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import useNotification from "../../../../hooks/useNotification";
import { useSignOutUserMutation } from "../../../../services/auth";
import FancyBtn from "../../../ui/button/FancyBtn/FancyBtn";
import ConfirmationPopup from "../../ConfirmationPopup/ConfirmationPopup";
import styles from "./UserProfile.module.css";

const UserProfile = ({ onClose, profileBtnRef }) => {
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNotification = useNotification();
  const { confirm, confirmationProps } = useConfirmation();
  const { isOpen: isConfirmationOpen } = confirmationProps;
  const isConfirmationOpenRef = useRef();

  const [signOutUser, { isLoading }] = useSignOutUserMutation();
  const { user } = useSelector((state) => state.user);

  // Keep a ref updated with confirmation open state
  useEffect(() => {
    isConfirmationOpenRef.current = isConfirmationOpen;
  }, [isConfirmationOpen]);

  const handleSignOut = async () => {
    try {
      // Ask for the confirmation
      const warningResult = await confirm({
        title: "Are you sure?",
        message: "You will be logged out of your account.",
        confirmText: "Yes, Log Out",
        cancelText: "Cancel",
        confirmColor: "#d33",
        cancelColor: "#3085d6",
      });
      if (warningResult !== true) {
        return;
      }

      // Perform sign-out logic
      await signOutUser();

      // Redirect to home page
      navigate("/");

      // Update auth state
      dispatch(setSignOutUser());

      // Clear local storage
      localStorage.removeItem("access-token");

      // Confirm the user has been signed out
      showNotification({
        title: "Sign out successful",
        message: "You have been logged out successfully.",
        iconType: "success",
        duration: 4000,
      });
    } catch (error) {
      console.log("Error during sign out:", error);

      // Show error message to the user
      showNotification({
        title: "Unable to sign out",
        message:
          error.data?.message ||
          error.message ||
          "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    } finally {
      onClose();
    }
  };

  const handleMyspaceNavigation = () => {
    navigate("/my-space");
    onClose();
  };

  // close profile on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      e.stopPropagation();

      // Don't close if confirmation is active
      if (isConfirmationOpenRef.current) return;

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        !profileBtnRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose, profileBtnRef]);

  return (
    <div className={styles.userProfile} ref={profileRef}>
      <ConfirmationPopup {...confirmationProps} />
      <div className={styles.profilePicture}>
        <img
          src={user?.profilePicture || defaultUserProfileImage}
          alt="profile picture"
        />
      </div>
      <div className={styles.userName}>
        <h3>{user?.name}</h3>
      </div>
      <div className={styles.viewProfileBtn}>
        <Link to="/profile">
          <FancyBtn
            clickHandler={onClose}
            btnWidth={"130px"}
            btnHeight={"37px"}
          >
            view profile
          </FancyBtn>
        </Link>
      </div>
      <div className={styles.userProfileTabs}>
        <ul>
          <li onClick={handleMyspaceNavigation}>
            <RiDashboardFill /> My Space
          </li>
          <li onClick={handleSignOut}>
            <BiLogOut />
            {isLoading ? "sign outing..." : "sign out"}
          </li>
        </ul>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  onClose: PropTypes.func.isRequired,
  profileBtnRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLButtonElement),
  }),
};
export default UserProfile;
