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
          <div className={styles.week}>
            <div>
              <h3>Week 01</h3>
              <p>Created: 10/16/24</p>
              <p>Updated: 10/16/24</p>
            </div>
            <div>
              <p>Memorized: 39</p>
              <p>Need revision: 11</p>
            </div>
          </div>
          <div className={styles.week}>
            <div>
              <h3>Week 02</h3>
              <p>Created: 10/16/24</p>
              <p>Updated: 10/16/24</p>
            </div>
            <div>
              <p>Memorized: 39</p>
              <p>Need revision: 11</p>
            </div>
          </div>
          <div className={styles.week}>
            <div>
              <h3>Week 03</h3>
              <p>Created: 10/16/24</p>
              <p>Updated: 10/16/24</p>
            </div>
            <div>
              <p>Memorized: 39</p>
              <p>Need revision: 11</p>
            </div>
          </div>
          <div className={styles.week}>
            <div>
              <h3>Week 04</h3>
              <p>Created: 10/16/24</p>
              <p>Updated: 10/16/24</p>
            </div>
            <div>
              <p>Memorized: 39</p>
              <p>Need revision: 11</p>
            </div>
          </div>
          <div className={styles.week}>
            <div>
              <h3>Week 05</h3>
              <p>Created: 10/16/24</p>
              <p>Updated: 10/16/24</p>
            </div>
            <div>
              <p>Memorized: 39</p>
              <p>Need revision: 11</p>
            </div>
          </div>
          <div className={styles.week}>
            <div>
              <h3>Week 06</h3>
              <p>Created: 10/16/24</p>
              <p>Updated: 10/16/24</p>
            </div>
            <div>
              <p>Memorized: 39</p>
              <p>Need revision: 11</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MySpace;
