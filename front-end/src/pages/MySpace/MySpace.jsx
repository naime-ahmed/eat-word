import { useCallback, useEffect, useState } from "react";
import { TbFaceIdError, TbLivePhotoFilled } from "react-icons/tb";
import MilestoneCard from "../../components/MilestoneCard/MilestoneCard";
import Popup from "../../components/Popup/Popup";
import MilestoneRequirements from "../../components/Popup/PopUpContents/MilestoneRequirements/MilestoneRequirements";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import HalfCircleChart from "../../components/ui/chart/HalfCircleChart/HalfCircleChart";
import Skeleton from "../../components/ui/loader/Skeleton/Skeleton";
import Tooltip from "../../components/ui/Tooltip/Tooltip";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./MySpace.module.css";

const MySpace = () => {
  const [isTakingRequirements, setIsTakingRequirements] = useState(false);
  const [viewMilestone, setViewMilestone] = useState(() => {
    return localStorage.getItem("selectedMS") || "seven";
  });
  const [milestones, setMilestones] = useState([]);

  const { data, isLoading, isError, error } = useBringMilestonesQuery();

  // manage the scroll position
  useScrollRestoration();

  // tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const showTooltip = (content) => (e) => {
    setTooltip({ visible: true, content, x: e.clientX, y: e.clientY });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // count of milestones and words
  let completedMilestone = 0;
  let totalWords = 0;
  let totalMemorizedWords = 0;
  let inProgress = 0;

  for (const milestone of milestones) {
    totalWords += milestone?.wordsCount;
    totalMemorizedWords += milestone?.memorizedCount;

    if (milestone?.targetWords === milestone?.wordsCount) {
      completedMilestone++;
    }

    // calculate inprogress milestones
    const duration = milestone?.milestoneType === "three" ? 3 : 7;
    const createdDate = new Date(milestone.createdAt);
    const targetDate = new Date(
      createdDate.getTime() + duration * 24 * 60 * 60 * 1000
    );
    const currentDate = new Date();
    if (targetDate > currentDate) {
      inProgress++;
    }
  }

  // Update milestones state when data is fetched
  useEffect(() => {
    if (data?.milestones) {
      setMilestones(data.milestones);
    }
  }, [data]);

  const handleSelectMSType = useCallback((MSType) => {
    localStorage.setItem("selectedMS", MSType);
    setViewMilestone(MSType);
  }, []);

  // Filter milestones by selected type
  const filteredMilestones = milestones?.filter(
    (milestone) => milestone?.milestoneType === viewMilestone
  );

  // Sort milestones: pinned milestones first
  const sortedMilestones = filteredMilestones?.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const openReqModal = useCallback(() => setIsTakingRequirements(true), []);
  const closeReqModal = useCallback(() => setIsTakingRequirements(false), []);

  // retry on error
  const retry = () => window.location.reload();

  return (
    <div className={styles.myspacePage}>
      <Header />
      <div className={styles.myspaceContainer}>
        <div className={styles.mySpaceHeading}>
          <div className={styles.createNewMilestoneBtn}>
            <AddBtn handleOpenModal={openReqModal}>New Milestone</AddBtn>
          </div>
          <Popup
            isOpen={isTakingRequirements}
            onClose={closeReqModal}
            closeOnOutsideClick={false}
          >
            <MilestoneRequirements
              handleViewMilestone={setViewMilestone}
              onClose={closeReqModal}
            />
          </Popup>
          <div className={styles.statistics}>
            <div
              className={styles.milestoneChart}
              style={{
                "--completedColor":
                  completedMilestone === 0
                    ? "#5777a6"
                    : "rgba(0, 100, 214, 0.95)",
              }}
            >
              <div className={styles.milestoneChartHeading}>
                <small>Milestones</small>
                <div
                  className={styles.inProgress}
                  title="Milestone in progress"
                  onMouseEnter={showTooltip(
                    `${inProgress} Milestone in progress`
                  )}
                  onMouseLeave={hideTooltip}
                >
                  <span className={styles.inProgressIcon}>
                    <TbLivePhotoFilled />
                  </span>
                  <span>{inProgress}</span>
                  <Tooltip
                    visible={tooltip.visible}
                    content={tooltip.content}
                    x={tooltip.x}
                    y={tooltip.y}
                  />
                </div>
              </div>
              <HalfCircleChart
                achieved_count={completedMilestone}
                remains_count={milestones.length - completedMilestone}
                thickness={24}
                achieved_tooltip={`${completedMilestone} Completed`}
                remains_tooltip={`${
                  milestones.length - completedMilestone
                } Remaining`}
                achieved_color_one="#0064D6"
                achieved_color_two="#B0D6FF"
                remains_color_one="#1A2330"
                remains_color_two="#7DA8D4"
              />
              <div className={styles.chartCaption}>
                <small>Completed</small>
                <small>Remains</small>
              </div>
            </div>
            <div
              className={styles.wordsChart}
              style={{
                "--completedColor":
                  completedMilestone === 0
                    ? "#5777a6"
                    : "rgba(0, 100, 214, 0.95)",
              }}
            >
              <div className={styles.wordsChartHeading}>
                <small>Words</small>
              </div>
              <HalfCircleChart
                achieved_count={totalMemorizedWords}
                remains_count={totalWords - totalMemorizedWords}
                thickness={24}
                achieved_tooltip={`${totalMemorizedWords} Memorized`}
                remains_tooltip={`${
                  totalWords - totalMemorizedWords
                } Not Memorized`}
                achieved_color_one="#0064D6"
                achieved_color_two="#B0D6FF"
                remains_color_one="#1A2330"
                remains_color_two="#7DA8D4"
              />
              <div className={styles.chartCaption}>
                <small>Memorized</small>
                <small>Remains</small>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.contentSkeleton}>
            <div className={styles.headerSkeleton}>
              <Skeleton width={100} height={30} />
              <Skeleton width={100} height={30} />
              <Skeleton width={100} height={30} />
            </div>
            <div className={styles.milestoneSkeleton}>
              <Skeleton width={291} height={80} />
              <Skeleton width={291} height={80} />
              <Skeleton width={291} height={80} />
              <Skeleton width={291} height={80} />
            </div>
          </div>
        ) : isError ? (
          <Error
            message={
              error?.message || "something went wrong while bringing milestones"
            }
            showRetry={true}
            onRetry={retry}
          />
        ) : (
          <div className={styles.mySpaceContent}>
            <div className={styles.tabs}>
              <ul>
                {["zero", "three", "seven"].map((type) => (
                  <li
                    key={type}
                    onClick={() => handleSelectMSType(type)}
                    className={viewMilestone === type ? styles.active : ""}
                  >
                    {type === "seven"
                      ? "7-Day Milestones"
                      : type === "three"
                      ? "3-Day Milestones"
                      : "Flexible Learning"}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.milestonesSection}>
              {filteredMilestones?.length === 0 ? (
                <Error
                  message="You've not set this Milestone yet!"
                  icon={TbFaceIdError}
                />
              ) : (
                <div className={styles.milestones}>
                  {sortedMilestones?.map((milestone) => (
                    <MilestoneCard key={milestone._id} milestone={milestone} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MySpace;
