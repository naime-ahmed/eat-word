import PropTypes from "prop-types";
import { FiAlertCircle } from "react-icons/fi";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./Error.module.css";

const Error = ({
  message = "Something went wrong!",
  icon: IconComponent,
  showRetry = false,
  onRetry,
  retryLabel = "Try Again",
  className = "",
  children,
  ...rest
}) => {
  if (children) {
    return (
      <div className={`${styles.errorContainer} ${className}`} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${styles.errorContainer} ${className}`} {...rest}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          {IconComponent ? (
            <IconComponent size={50} />
          ) : (
            <FiAlertCircle size={50} />
          )}
        </div>
        <div className={styles.errorMessage}>
          <p>{message}</p>
        </div>
        {showRetry && onRetry && (
          <div className={styles.errorAction}>
            <PrimaryBtn handleClick={onRetry}>{retryLabel}</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string,
  icon: PropTypes.elementType,
  showRetry: PropTypes.bool,
  onRetry: PropTypes.func,
  retryLabel: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Error;
