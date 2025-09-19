import PropTypes from "prop-types";
import styles from "./ShinyText.module.css";

const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  textColor = "#b5b5b5a4",
  shineColor = "rgba(255, 255, 255, 0.8)",
  style = {},
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`${styles.shinyText} ${disabled ? styles.disabled : ""}`}
      style={{
        animationDuration,
        "--text-color": textColor,
        "--shine-color": shineColor,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

ShinyText.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  speed: PropTypes.number,
  textColor: PropTypes.string,
  shineColor: PropTypes.string,
  style: PropTypes.object,
};

export default ShinyText;
