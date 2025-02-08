import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MilestoneDeadline from "../../components/MilestoneDeadline";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import Slider from "../../components/WordsContainer/Slider/Slider";
import Table from "../../components/WordsContainer/Table/Table";
import {
  useBringMilestonesQuery,
  useEditMilestoneMutation,
} from "../../services/milestone";
import { formatDate } from "../../utils/formateDate";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const [wordContainerType, setWordContainerType] = useState("table");

  const [isOnRecallMood, setIsOnReCallMood] = useState(false);
  const timeoutRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);

  const { milestoneId } = useParams();
  const { data, isLoading, isError, error } = useBringMilestonesQuery();
  const [editMilestone] = useEditMilestoneMutation();

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

  const curMilestone = useMemo(
    () => data?.milestones?.find((milestone) => milestone._id === milestoneId),
    [data?.milestones, milestoneId]
  );
  const duration = curMilestone?.milestoneType === "three" ? 3 : 7;

  // handle on recall
  const handleOnRecall = (e) => {
    if (curMilestone?.wordsCount <= 0) {
      return;
    }
    setIsOnReCallMood(e.target.checked);
  };

  // Update lastRecalled effect - Fixed version
  useEffect(() => {
    let tooltipTimeout;

    const handleRecallCompletion = async () => {
      try {
        // Correct mutation call format based on RTK Query expectations
        await editMilestone([
          curMilestone._id,
          { lastRecalled: new Date().toISOString() },
        ]).unwrap();
        setHasUpdated(true);
        console.log("Recall recorded");
      } catch (error) {
        console.error("Update failed:", error);
      }
    };

    if (isOnRecallMood && curMilestone && !hasUpdated) {
      setShowTooltip(true);
      tooltipTimeout = setTimeout(() => setShowTooltip(false), 4000);

      const durationMs = Math.min(5, curMilestone.wordsCount) * 60000;
      timeoutRef.current = setTimeout(handleRecallCompletion, durationMs);
    }

    return () => {
      // Cleanup timeouts and reset state
      clearTimeout(tooltipTimeout);
      clearTimeout(timeoutRef.current);

      if (!isOnRecallMood) {
        timeoutRef.current = null;
        setHasUpdated(false);
      }
    };
  }, [isOnRecallMood, curMilestone?._id, hasUpdated]); // eslint-disable-line react-hooks/exhaustive-deps

  const formattedDate = curMilestone?.lastRecalled
    ? formatDate(curMilestone?.lastRecalled)
    : "";

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
                        onChange={handleOnRecall}
                        disabled={curMilestone?.wordsCount <= 0}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    {showTooltip && (
                      <div className={styles.tooltip}>
                        Complete all words to count recall
                      </div>
                    )}
                    <span>
                      {curMilestone?.wordsCount <= 0
                        ? "No words to recall" // Show message
                        : isOnRecallMood
                        ? "Off recall"
                        : "On recall"}
                    </span>
                  </div>
                  <div className={styles.lastRecalled}>
                    <span>
                      {curMilestone?.lastRecalled
                        ? `Last Recall: ${formattedDate}`
                        : "You haven't recalled"}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.divider}></div>

              {wordContainerType === "table" ? (
                <Table
                  curMilestone={curMilestone}
                  isOnRecallMood={isOnRecallMood}
                />
              ) : (
                <Slider
                  curMilestone={curMilestone}
                  isOnRecallMood={isOnRecallMood}
                />
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
