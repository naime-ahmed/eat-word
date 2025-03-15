import PropTypes from "prop-types";
import styles from "./ClassicSpinner.module.css";

const ClassicSpinner = ({
  size = "3.25em",
  color = "hsl(214, 97%, 59%)",
  speed = 1,
}) => {
  const spinnerStyle = {
    "--spinner-size": size,
    "--spinner-color": color,
    "--rotate-duration": `${2 / speed}s`,
    "--dash-duration": `${1.5 / speed}s`,
  };

  return (
    <svg
      className={styles.classicSpinner}
      viewBox="25 25 50 50"
      style={spinnerStyle}
    >
      <circle r="20" cy="50" cx="50" />
    </svg>
  );
};

ClassicSpinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  speed: PropTypes.number,
};

export default ClassicSpinner;
