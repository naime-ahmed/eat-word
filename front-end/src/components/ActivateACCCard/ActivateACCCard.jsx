import PropTypes from "prop-types";
import { MdError } from "react-icons/md";
import { PiShieldCheckFill } from "react-icons/pi";
import PrimaryBtn from "../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./ActivateACCCard.module.css";

// add icon from react-icons
const ActivateACCCard = ({
  isSuccess,
  p1,
  p2,
  btnText,
  btnClick,
  btnColorLeft,
  btnColorRight,
}) => {
  return (
    <div
      className={styles.ActivateACCCard}
      style={
        isSuccess
          ? { border: "2px solid rgb(1, 160, 35)" }
          : { border: "2px solid rgb(153, 0, 26)" }
      }
    >
      <small
        className={isSuccess ? `${styles.successIcon}` : `${styles.errorIcon}`}
      >
        {isSuccess ? <PiShieldCheckFill /> : <MdError />}
      </small>
      <div className={styles.ActivateACCCardText}>
        <p>{p1}</p>
        <p>{p2}</p>
      </div>
      <PrimaryBtn
        handleClick={btnClick}
        colorOne={btnColorLeft}
        colorTwo={btnColorRight}
      >
        {btnText}
      </PrimaryBtn>
    </div>
  );
};

// Define Prop types
ActivateACCCard.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  p1: PropTypes.string.isRequired,
  p2: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  btnClick: PropTypes.func.isRequired,
  btnColorLeft: PropTypes.string.isRequired,
  btnColorRight: PropTypes.string.isRequired,
};

export default ActivateACCCard;
