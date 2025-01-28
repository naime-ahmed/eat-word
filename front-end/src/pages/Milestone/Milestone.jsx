import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MilestoneDeadline from "../../components/dynamicComponents/MilestoneDeadline/MilestoneDeadline";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import Slider from "../../components/WordsContainer/Slider/Slider";
import Table from "../../components/WordsContainer/Table/Table";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const [isOnRecallMood, setIsOnReCallMood] = useState(false);
  const [wordContainerType, setWordContainerType] = useState("table");
  const { milestoneId } = useParams();
  const { data, isLoading, isError, error } = useBringMilestonesQuery();

  // measure the screen size
  useEffect(() => {
    const countScreenSize = () => {
      if (window.innerWidth < 1000) {
        setWordContainerType("slider");
      } else {
        setWordContainerType("table");
      }
    };
    countScreenSize();
    window.addEventListener("resize", countScreenSize);
    return () => {
      window.removeEventListener("resize", countScreenSize);
    };
  }, []);

  const curMilestone = data?.milestones?.find(
    (milestone) => milestone._id === milestoneId
  );
  const duration = curMilestone?.milestoneType === "three" ? 3 : 7;

  return (
    <div className={styles.milestonePage}>
      <Header />

      {isLoading ? (
        <SpinnerForPage />
      ) : (
        <div className={styles.milestoneContent}>
          {isError ? (
            <Error error={error} />
          ) : (
            <>
              <div className={styles.milestoneHeading}>
                <div className={styles.nameAndLeftTime}>
                  <div className={styles.milestoneName}>
                    <h3>{curMilestone?.name}</h3>
                  </div>
                  <div className={styles.milestoneTimeLeft}>
                    <MilestoneDeadline
                      createdAt={curMilestone?.createdAt}
                      duration={duration}
                    />
                  </div>
                </div>
                <div className={styles.recallAndLastRecall}>
                  <div className={styles.checkboxAndLabels}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        onChange={(e) => setIsOnReCallMood(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span>{isOnRecallMood ? "Off recall" : "On recall"}</span>
                  </div>
                  <div className={styles.lastRecalled}>
                    <span>Last: 2d 23h 44m ago</span>
                  </div>
                </div>
              </div>
              <div className={styles.divider}></div>

              {wordContainerType === "table" ? (
                <Table curMilestone={curMilestone} />
              ) : (
                <Slider curMilestone={curMilestone} />
              )}
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Milestone;
