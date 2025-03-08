import PrimaryBtn from "../../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./GeneralMessage.module.css";

const GeneralMessage = ({ title, message, onClose, btnText }) => {
  return (
    <div className={styles.GMContainer}>
      <div>{title}</div>
      <div>{message}</div>
      <PrimaryBtn handleClick={onClose}>{btnText}</PrimaryBtn>
    </div>
  );
};

export default GeneralMessage;
