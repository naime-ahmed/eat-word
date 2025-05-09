import PropTypes from "prop-types";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./PromoBanner.module.css";

const PromoBanner = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <aside
      className={styles.promoBanner}
      role="region"
      aria-label="Limited Time Offer"
    >
      <div className={styles.promoContent}>
        <strong className={styles.promoLabel}>🔥 Hot Deal:</strong>
        <span className={styles.promoText}>
          Unlock 1 MONTH of Pro features for
          <strong className={styles.promoLabel}> FREE</strong> — limited to the
          first 200 early birds!
        </span>
        <Link to="/sign-up" className={styles.promoLink}>
          Claim Yours Now
        </Link>
      </div>
      <button
        className={styles.promoClose}
        onClick={onClose}
        aria-label="Close promotion"
      >
        <IoCloseOutline size={24} />
      </button>
    </aside>
  );
};

PromoBanner.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default PromoBanner;
