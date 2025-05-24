import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import defaultUserProfile from "../../assets/defaultUserProfileImage.webp";
import styles from "./AvatarReview.module.css";

const AvatarReview = ({
  avatars,
  trustedUsersCount,
  maxDisplayedAvatars = 4,
}) => {
  const displayedAvatars = avatars.slice(0, maxDisplayedAvatars);

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.avatarGroup}>
        {displayedAvatars.map((avatar, index) => (
          <div
            key={avatar.profileUrl || `avatar-${index}`}
            className={styles.avatarWrapper}
            style={{ zIndex: index + 5 }}
          >
            <a
              href={avatar.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.avatarLink}
              aria-label={`View profile of ${avatar.altText}`}
            >
              <img
                className={styles.avatarImage}
                src={avatar.imageUrl || defaultUserProfile}
                alt={avatar.altText}
              />
            </a>
          </div>
        ))}
      </div>
      <div className={styles.reviewInfo}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <FaStar key={`star-${i}`} className={styles.starIcon} />
          ))}
        </div>
        <p className={styles.trustText}>
          Trusted by {trustedUsersCount}+ users
        </p>
      </div>
    </div>
  );
};

AvatarReview.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      profileUrl: PropTypes.string.isRequired,
      altText: PropTypes.string,
    })
  ).isRequired,
  trustedUsersCount: PropTypes.number.isRequired,
  maxDisplayedAvatars: PropTypes.number,
};

export default AvatarReview;
