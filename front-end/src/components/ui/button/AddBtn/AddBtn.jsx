import PropTypes from "prop-types";
import { FiPlus } from "react-icons/fi";
import styles from "./AddBtn.module.css";

const AddBtn = ({ children, handleOpenModal }) => {
  return (
    <button className={styles.button} onClick={handleOpenModal}>
      <span>
        {children}
        <FiPlus className={styles.icon} />
      </span>
    </button>
  );
};

AddBtn.propTypes = {
  children: PropTypes.node,
  handleOpenModal: PropTypes.func.isRequired,
};

export default AddBtn;
