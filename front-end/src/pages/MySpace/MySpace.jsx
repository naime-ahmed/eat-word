import { useCallback, useEffect, useState } from "react";
import MilestoneCard from "../../components/dynamicComponents/MilestoneCard/MilestoneCard";
import Popup from "../../components/Popup/Popup";
import MilestoneRequirements from "../../components/Popup/PopUpContents/MilestoneRequirements/MilestoneRequirements";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./MySpace.module.css";

const MySpace = () => {
  const [isTakingRequirements, setIsTakingRequirements] = useState(false);
  const [viewMilestone, setViewMilestone] = useState(() => {
    return localStorage.getItem("selectedMS") || "seven";
  });
  const [milestones, setMilestones] = useState([]);

  const { data, isLoading, isError, error } = useBringMilestonesQuery();

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
    if (a.pinned && !b.pinned) return -1; // a comes first
    if (!a.pinned && b.pinned) return 1; // b comes first
    return 0; // no change in order
  });
  console.log("sorted milestone", sortedMilestones);

  const openReqModal = useCallback(() => setIsTakingRequirements(true), []);
  const closeReqModal = useCallback(() => setIsTakingRequirements(false), []);

  return (
    <div className={styles.myspacePage}>
      <Header />
      <div className={styles.myspaceContainer}>
        <div className={styles.mySpaceHeading}>
          <div className={styles.createNewMilestoneBtn}>
            <AddBtn handleOpenModal={openReqModal} />
          </div>

          <Popup
            isOpen={isTakingRequirements}
            onClose={closeReqModal}
            closeOnOutsideClick={false}
          >
            <MilestoneRequirements handleViewMilestone={setViewMilestone} />
          </Popup>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <Error error={error} />
        ) : (
          <div className={styles.mySpaceContent}>
            <div className={styles.tabs}>
              <ul>
                {["seven", "three", "zero"].map((type) => (
                  <li
                    key={type}
                    onClick={() => handleSelectMSType(type)}
                    className={viewMilestone === type ? styles.active : ""}
                  >
                    {type === "seven"
                      ? "7-Day challenges"
                      : type === "three"
                      ? "3-Day Challenges"
                      : "Flexible Learning"}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.milestonesSection}>
              {filteredMilestones?.length === 0 ? (
                <Error
                  error={{
                    data: {
                      message: "You've not taken this challenge yet!",
                    },
                    status: 404,
                  }}
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
