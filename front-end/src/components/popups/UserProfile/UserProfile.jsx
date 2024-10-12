import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import defaultUserProfileImage from "../../../assets/defaultUserProfileImage.png";
import { setSignOutUser } from "../../../features/auth/authSlice";
import { useSignOutUserMutation } from "../../../services/auth";
import FancyBtn from "../../ui/button/FancyBtn/FancyBtn";
import styles from "./UserProfile.module.css";

const UserProfile = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signOutUser, { isLoading }] = useSignOutUserMutation();

  const handleSignOut = async () => {
    try {
      // Wait for the Swal result
      const warningResult = await Swal.fire({
        title: "Are you sure?",
        text: "You will be signed out if you press yes!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, sign out",
      });

      // console.log(warningResult);

      // Check if the user confirmed the sign-out
      if (!warningResult.isConfirmed) {
        return;
      }

      // Perform sign-out logic
      const result = await signOutUser();

      // Update auth state
      dispatch(setSignOutUser());

      console.log(result);
      // Clear local storage
      localStorage.removeItem("access-token");

      // Confirm the user has been signed out
      Swal.fire({
        title: result.data?.message,
        icon: "success",
        confirmButtonText: "Got it",
      });

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.log("Error during sign out:", error);

      // Show error message to the user
      Swal.fire({
        title: "Unable to sign out",
        text:
          error.data?.message ||
          error.message ||
          "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.profilePicture}>
        <img src={defaultUserProfileImage} alt="profile picture" />
      </div>
      <div className={styles.userName}>
        <h3>User name</h3>
      </div>
      <div className={styles.viewProfileBtn}>
        <FancyBtn clickHandler={onClose} btnWidth={"130px"} btnHeight={"37px"}>
          view profile
        </FancyBtn>
      </div>
      <div className={styles.userProfileTabs}>
        <ul>
          <li onClick={onClose}>
            <Link to="/mySpace"> My Space</Link>
          </li>
          <li onClick={onClose}>
            <Link to="/leader-board">Leader board</Link>
          </li>
          <li onClick={onClose}>
            <i className="fas fa-sign-out-alt"></i>{" "}
            <span onClick={handleSignOut}>
              {isLoading ? "sign outing..." : "sign out0"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
