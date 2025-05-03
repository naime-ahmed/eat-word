import PropTypes from "prop-types";
import styles from "./TwoDBtn.module.css";

const TwoDBtn = ({ children, className, isDisabled, ...props }) => {
  return (
    <div
      className={`${className} ${isDisabled ? styles.disabledWrapper : ""}`}
      {...props}
    >
      <button className={styles.twoDBtn} disabled={isDisabled}>
        <span className={styles.shadow} />
        <span className={styles.edge} />
        <span className={styles.front}>{children}</span>
      </button>
    </div>
  );
};

TwoDBtn.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default TwoDBtn;
