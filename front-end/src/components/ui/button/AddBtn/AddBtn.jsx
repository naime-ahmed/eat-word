import styles from "./AddBtn.module.css";

const AddBtn = ({ handleRequirementClick }) => {
  return (
    <button
      className={`${styles.iconBtn} ${styles.addBtn}`}
      aria-label="Start a new week"
      onClick={handleRequirementClick}
    >
      <div className={styles.addIcon}></div>
      <div className={styles.btnTxt}>New Week</div>
    </button>
  );
};

export default AddBtn;