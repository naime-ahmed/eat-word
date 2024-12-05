import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./ActivateACCCard.module.css";

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
        {isSuccess ? (
          <i
            className="fa-solid fa-circle-check"
            style={{ color: "green" }}
          ></i>
        ) : (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ color: "red" }}
          ></i>
        )}
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

export default ActivateACCCard;
