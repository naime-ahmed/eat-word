import PropTypes from "prop-types";
import styles from "./ChooseMood.module.css";

const ChooseMood = ({ setQuizMode }) => {
  const handleMoodSelect = (mood) => {
    setQuizMode(mood);
  };

  return (
    <div className={styles.chooseMoodCard}>
      <h2 className={styles.title}>Choose your quiz mood</h2>

      <div className={styles.moodOptions}>
        <button
          className={styles.moodButton}
          onClick={() => handleMoodSelect("timed")}
          aria-label="Select Timed Challenge mode"
        >
          <div className={styles.buttonContent}>
            <span className={styles.moodIcon}>⏱️</span>
            <span className={styles.moodLabel}>Timed Challenge</span>
          </div>
          <p className={styles.moodDescription}>
            Race against the clock for an exciting challenge
          </p>
        </button>

        <button
          className={styles.moodButton}
          onClick={() => handleMoodSelect("practice")}
          aria-label="Select Relaxed Practice mode"
        >
          <div className={styles.buttonContent}>
            <span className={styles.moodIcon}>😌</span>
            <span className={styles.moodLabel}>Relaxed Practice</span>
          </div>
          <p className={styles.moodDescription}>
            Learn at your own pace without pressure
          </p>
        </button>
      </div>
    </div>
  );
};

ChooseMood.propTypes = {
  setQuizMode: PropTypes.func.isRequired,
};

export default ChooseMood;
