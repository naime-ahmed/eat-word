import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Countdown from "../../components/dynamicComponents/Countdown/Countdown";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const { user } = useSelector((state) => state.auth);
  const { milestoneId } = useParams();
  const { data, isLoading, isError, error } = useBringMilestonesQuery();
  console.log(user);
  // State for milestone name
  const [milestoneName, setMilestoneName] = useState("");

  const curMilestone = data?.milestones?.filter(
    (milestone) => milestone._id === milestoneId
  )[0];

  let duration = 7;
  if (curMilestone?.milestoneType === "three") {
    duration = 3;
  }

  // Set initial milestone name when data is loaded
  useEffect(() => {
    if (curMilestone?.name) {
      setMilestoneName(curMilestone.name);
    }
  }, [curMilestone]);

  // Handle input change
  const handleNameChange = (e) => {
    setMilestoneName(e.target.value);
    // Here implement throttled server update
    // Example: throttledUpdateServer(e.target.value);
  };

  return (
    <div className={styles.milestonePage}>
      <Header />

      {isLoading ? (
        <p>loading...</p>
      ) : (
        <div className={styles.milestoneContent}>
          {isError ? (
            <Error error={error} />
          ) : (
            <div className={styles.milestoneHeading}>
              <div className={styles.milestoneName}>
                <input
                  type="text"
                  name="milestoneName"
                  value={milestoneName}
                  onChange={handleNameChange}
                  className={styles.milestoneNameInput}
                />
              </div>
              <div className={styles.milestoneTimeLeft}>
                <Countdown
                  createdAt={curMilestone.createdAt}
                  duration={duration}
                />
              </div>
            </div>
          )}
          <div className={styles.divider}></div>
          <div className={styles.milestoneTable}></div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Milestone;
