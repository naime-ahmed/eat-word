import { useCallback, useEffect, useState } from "react";
import { TbFaceIdError } from "react-icons/tb";
import MilestoneCard from "../../components/MilestoneCard/MilestoneCard";
import Popup from "../../components/Popup/Popup";
import MilestoneRequirements from "../../components/Popup/PopUpContents/MilestoneRequirements/MilestoneRequirements";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import PairChart from "../../components/ui/chart/PairChart/PairChart";
import Skeleton from "../../components/ui/loader/Skeleton/Skeleton";
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

  // count of milestones and words
  let completedMilestone = 0;
  let totalWords = 0;
  let totalMemorizedWords = 0;

  for (const milestone of milestones) {
    totalWords += milestone?.wordsCount;
    totalMemorizedWords += milestone?.memorizedCount;

    if (milestone?.targetWords === milestone?.wordsCount) {
      completedMilestone++;
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
          <div className={styles.milestonesChart}>
            <PairChart
              totalCount={milestones.length}
              successCount={completedMilestone}
              totalTooltip={`Total Milestones: ${milestones.length}`}
              successTooltip={`Completed Milestones: ${completedMilestone}`}
              chartTitle="Milestones"
            />
            <PairChart
              totalCount={totalWords}
              successCount={totalMemorizedWords}
              totalTooltip={`Total Words: ${totalWords}`}
              successTooltip={`Memorized Words: ${totalMemorizedWords}`}
              chartTitle="Words"
            />
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
