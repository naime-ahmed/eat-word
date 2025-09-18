import PropTypes from "prop-types";
import styles from "./Tooltip.module.css";

const Tooltip = ({ visible = false, content = "", x = 0, y = 0 }) => {
  return (
    <div
      className={`${styles.tooltip} ${visible ? styles.visible : ""}`}
      style={{ left: x, top: y }}
    >
      {content}
    </div>
  );
};

Tooltip.propTypes = {
  visible: PropTypes.bool,
  content: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Tooltip;
