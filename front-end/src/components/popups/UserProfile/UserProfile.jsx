import defaultUserProfileImage from "../../../assets/defaultUserProfileImage.png";
import FancyBtn from "../../ui/button/FancyBtn/FancyBtn";
import styles from "./UserProfile.module.css";

const UserProfile = ({ onClose }) => {
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
          <li onClick={onClose}>My Space</li>
          <li onClick={onClose}>Leader board</li>
          <li onClick={onClose}>
            <i className="fas fa-sign-out-alt"></i> sign out
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
