import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const { user } = useSelector((state) => state.auth);
  const { milestoneId } = useParams();

  const { data, isLoading, isError, error } = useBringMilestonesQuery();

  const curMilestone = data?.milestones?.filter(
    (milestone) => milestone._id === milestoneId
  );

  console.log(curMilestone);

  return (
    <div className={styles.milestonePage}>
      <Header />

      {isLoading ? (
        <p>loading...</p>
      ) : isError ? (
        <Error error={error} />
      ) : (
        <div className={styles.milestoneContent}>
          Welcome to milestone {user?.email} sir, milestone : {milestoneId}, you
          : {user?.id}
          <div className={styles.milestoneHeading}>
            <div>
              <p>Challenge name:</p>
              <p>Challenge type:</p>
            </div>
            <div>
              <p>Time left: </p>
            </div>
            <div>
              <p>Number of targeted words:</p>
              <p>Number of current words:</p>
            </div>
          </div>
          <div className={styles.milestoneTable}></div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Milestone;
