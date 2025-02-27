import PropTypes from "prop-types";
import styles from "./Skeleton.module.css";

const Skeleton = ({ width, height, label = "" }) => {
  const getDimension = (value) => {
    if (typeof value === "number") return `${value}px`;
    if (typeof value === "string" && !isNaN(value)) return `${value}px`;
    return value;
  };

  return (
    <div
      className={styles.skeleton}
      style={{
        width: getDimension(width),
        height: getDimension(height),
        maxWidth: getDimension(width),
        maxHeight: getDimension(height),
      }}
    >
      {label}
    </div>
  );
};

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
};

export default Skeleton;
