import styles from "./PrimaryBtn.module.css";

const PrimaryBtn = ({ handleClick = () => {}, children }) => {
  return (
    <button onClick={handleClick} className={styles.btn}>
      {children}
    </button>
  );
};

export default PrimaryBtn;
