import PropTypes from "prop-types";
import styles from "./PrimaryBtn.module.css";

const PrimaryBtn = ({
  handleClick = () => {},
  isLoading = false,
  loadingText = "cooking...",
  colorOne = "#0a4bae",
  colorTwo = "#0c80c9",
  children,
  btnType = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={handleClick}
      type={btnType}
      style={{
        backgroundImage: `linear-gradient(to left, ${colorOne}, ${colorTwo})`,
      }}
      className={styles.btn}
      disabled={disabled}
      aria-disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

PrimaryBtn.propTypes = {
  handleClick: PropTypes.func,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  colorOne: PropTypes.string,
  colorTwo: PropTypes.string,
  children: PropTypes.node.isRequired,
  btnType: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PrimaryBtn;
