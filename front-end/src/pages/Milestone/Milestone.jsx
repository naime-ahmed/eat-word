import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const { user } = useSelector((state) => state.auth);

  const { milestoneId } = useParams();

  return (
    <div className={styles.milestonePage}>
      <Header />
      <div className={styles.milestoneContent}>
        Welcome to milestone {user.email} sir, milestone : {milestoneId}, you :{" "}
        {user.id}
        <div className={styles.milestoneHeading}>
          <div>
            <p>Name of milestone</p>
            <p>type of challenge</p>
          </div>
          <div>
            <p>Time left: </p>
          </div>
          <div>
            <p>Number of targeted words</p>
            <p>Number of current words</p>
          </div>
        </div>
        <div className={styles.milestoneTable}></div>
      </div>
      <Footer />
    </div>
  );
};

export default Milestone;
