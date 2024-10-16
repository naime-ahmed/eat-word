import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import styles from "./MySpace.module.css";

const MySpace = () => {
  return (
    <div className={styles.myspacePage}>
      <Header />
      <div className={styles.myspaceContainer}>
        <div className={styles.mySpaceHeading}>
          <div className={styles.createNewWeekBtn}>
            <AddBtn />
          </div>
        </div>
        <div className={styles.mySpaceContent}>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p title="Memorized">39</p>
                <p title="Required revision">11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p>39</p>
                <p>11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p>39</p>
                <p>11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p>39</p>
                <p>11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p>39</p>
                <p>11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p>39</p>
                <p>11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekMainContent}>
              <div className={styles.weekNum}>
                <p>Week 01</p>
              </div>
              <div className={styles.wordVerdict}>
                <p>39</p>
                <p>11</p>
              </div>
            </div>
            <p className={styles.weekCardLastEdit}>
              Last Touched: 17th oct 2024
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MySpace;
