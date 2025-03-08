import styles from "./SpinnerForPage.module.css";

const SpinnerForPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>

        <h3>loading...</h3>
      </div>
    </div>
  );
};

export default SpinnerForPage;
