import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import defaultUserProfile from "../../assets/defaultUserProfileImage.webp";
import styles from "./AvatarReview.module.css";

const AvatarReview = ({
  avatars,
  trustedUsersCount,
  maxDisplayedAvatars = 4,
  countCircleText = "99+",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const displayedAvatars = avatars.slice(0, maxDisplayedAvatars);
  const avatarStaggerDelay = 0.1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.avatarGroup}>
        {displayedAvatars.map((avatar, index) => (
          <div
            key={avatar.profileUrl || `avatar-${index}`}
            className={`
              ${styles.avatarWrapper}
              ${styles.animatedElement}
              ${isVisible ? styles.startAnimation : ""}
            `}
            style={{
              zIndex: index + 5,
              "--animation-delay": `${index * avatarStaggerDelay}s`,
            }}
          >
            <a
              href={avatar.profileUrl}
              rel="noopener noreferrer"
              className={styles.avatarLink}
              aria-label={`View profile of ${
                avatar.altText || `User ${index + 1}`
              }`}
            >
              <img
                className={styles.avatarImage}
                src={avatar.imageUrl || defaultUserProfile}
                alt={avatar.altText || `User ${index + 1}`}
              />
            </a>
          </div>
        ))}

        <div
          className={`
            ${styles.avatarWrapper}
            ${styles.animatedElement}
            ${isVisible ? styles.startAnimation : ""}
          `}
          style={{
            zIndex: displayedAvatars.length + 5,
            "--animation-delay": `${
              displayedAvatars.length * avatarStaggerDelay
            }s`,
          }}
          aria-label={`${countCircleText} more users`}
        >
          <div className={styles.countCircle}>{countCircleText}</div>
        </div>
      </div>

      <div
        className={`
          ${styles.reviewInfo}
          ${styles.animatedElement}
          ${isVisible ? styles.startAnimation : ""}
        `}
        style={{
          "--animation-delay": `${
            (displayedAvatars.length + 1) * avatarStaggerDelay + 0.1
          }s`,
        }}
      >
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
      imageUrl: PropTypes.string,
      profileUrl: PropTypes.string.isRequired,
      altText: PropTypes.string,
    })
  ).isRequired,
  trustedUsersCount: PropTypes.number.isRequired,
  maxDisplayedAvatars: PropTypes.number,
  countCircleText: PropTypes.string,
};

export default AvatarReview;
