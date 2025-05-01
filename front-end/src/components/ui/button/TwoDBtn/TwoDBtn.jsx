import PropTypes from "prop-types";
import styles from "./TwoDBtn.module.css";

const TwoDBtn = ({ children, className, ...props }) => {
  return (
    <div className={className} {...props}>
      <button className={styles.twoDBtn}>
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
};

export default TwoDBtn;
