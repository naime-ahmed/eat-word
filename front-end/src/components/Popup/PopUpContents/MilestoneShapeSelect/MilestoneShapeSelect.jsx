import PropTypes from "prop-types";
import { ImTable2 } from "react-icons/im";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import styles from "./MilestoneShapeSelect.module.css";

const MilestoneShapeSelect = ({ setWordContainerType, onClose }) => {
  const handleSelectType = (shape) => {
    setWordContainerType(shape);
    localStorage.setItem("wordContainerType", shape);

    onClose();
  };

  return (
    <div className={styles.shapeSelectContainer}>
      <ul>
        <li onClick={() => handleSelectType("table")}>
          <span>
            <ImTable2 />
          </span>{" "}
          Table
        </li>
        <li onClick={() => handleSelectType("slider")}>
          <span>
            <TfiLayoutSliderAlt />
          </span>{" "}
          Slide
        </li>
      </ul>
    </div>
  );
};

MilestoneShapeSelect.propTypes = {
  setWordContainerType: PropTypes.func,
  onClose: PropTypes.func,
};

export default MilestoneShapeSelect;
