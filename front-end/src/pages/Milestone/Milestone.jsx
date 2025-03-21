import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MilestoneDeadline from "../../components/MilestoneDeadline";
import MilestoneStory from "../../components/MilestoneStory/MilestoneStory";
import Popup from "../../components/Popup/Popup";
import MilestoneStoryGenerator from "../../components/Popup/PopUpContents/MilestoneStoryGenerator/MilestoneStoryGenerator";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import Slider from "../../components/WordsContainer/Slider/Slider";
import Table from "../../components/WordsContainer/Table/Table";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import {
  useBringMilestonesQuery,
  useEditMilestoneMutation,
} from "../../services/milestone";
import { formatDate } from "../../utils/formateDate";
import styles from "./Milestone.module.css";

const confettiColors = [
  "#FF5733",
  "#FFC300",
  "#28B463",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#F1C40F",
  "#2ECC71",
];

const getRandomColor = () =>
  confettiColors[Math.floor(Math.random() * confettiColors.length)];

const Milestone = () => {
  const [wordContainerType, setWordContainerType] = useState("table");

  const [isOnRecallMood, setIsOnReCallMood] = useState(false);
  const timeoutRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [isTakingStoryType, setIsTakingStoryType] = useState(false);

  const { milestoneId } = useParams();
  const { data, isLoading, isError, error } = useBringMilestonesQuery();
  const [editMilestone] = useEditMilestoneMutation();

  let confettiCount = 20;
  if (wordContainerType === "slider") {
    confettiCount = 14;
  }

  // manage the scroll position
  useScrollRestoration();

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

  useEffect(() => {
    let tooltipTimeout;

    const handleRecallCompletion = async () => {
      try {
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

  // forcing to disappear tool tip on isOnRecallMood off
  useEffect(() => {
    if (!isOnRecallMood) {
      setShowTooltip(false);
    }
  }, [isOnRecallMood]);

  const formattedDate = curMilestone?.lastRecalled
    ? formatDate(curMilestone?.lastRecalled)
    : "";

  // reached the milestone?
  const hasReached = curMilestone?.wordsCount === curMilestone?.targetWords;

  const handleOpenGenerateStory = () => {
    setIsTakingStoryType(true);
  };
  console.log(curMilestone);
  return (
    <div className={styles.milestonePage}>
      <Header />

      {isLoading ? (
        <SpinnerForPage />
      ) : (
        <div className={styles.milestoneContent}>
          {isError ? (
            <Error
              message={
                error?.message || "something went wrong! Try reloading the page"
              }
              showRetry={true}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <div className={styles.milestoneHeading}>
                <div className={styles.nameAndLeftTime}>
                  <div className={styles.milestoneName}>
                    <h3>{curMilestone?.name}</h3>
                  </div>
                  <div className={styles.milestoneTimeLeft}>
                    {curMilestone.milestoneType !== "zero" ? (
                      <MilestoneDeadline
                        createdAt={curMilestone?.createdAt}
                        duration={duration}
                      />
                    ) : (
                      <span>Time left: Infinite</span>
                    )}
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

              {hasReached && curMilestone?.story === "" && (
                <div
                  className={styles.hasReached}
                  onClick={handleOpenGenerateStory}
                >
                  <p>
                    Yay! You&#39;ve successfully reached the milestone! Click to
                    get a story with your words
                  </p>
                  <div className={styles.confettiContainer}>
                    {Array.from({ length: confettiCount }).map((_, i) => (
                      <div
                        key={i}
                        className={styles.confetti}
                        style={{
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          backgroundColor: getRandomColor(),
                        }}
                      />
                    ))}
                  </div>
                  <Popup
                    isOpen={isTakingStoryType}
                    onClose={() => setIsTakingStoryType(false)}
                  >
                    <MilestoneStoryGenerator
                      onClose={() => setIsTakingStoryType(false)}
                      milestoneId={curMilestone._id}
                    />
                  </Popup>
                </div>
              )}
              {curMilestone.story && (
                <MilestoneStory story={curMilestone?.story} />
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
