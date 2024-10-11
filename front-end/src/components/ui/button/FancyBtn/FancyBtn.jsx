import styles from "./FancyBtn.module.css";

const FancyBtn = ({ children, clickHandler, btnWidth, btnHeight }) => {
  return (
    <button
      onClick={clickHandler}
      style={{ width: btnWidth, height: btnHeight }}
      className={styles.fancyBtn}
    >
      {children}
    </button>
  );
};

export default FancyBtn;
