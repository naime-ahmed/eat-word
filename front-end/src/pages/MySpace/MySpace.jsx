import { useCallback, useState } from "react";
import MilestoneCard from "../../components/dynamicComponents/MilestoneCard/MilestoneCard";
import TakeMilestoneRequirements from "../../components/popups/milestoneRequirements/milestoneRequirements";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./MySpace.module.css";

const MySpace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMilestone, setViewMilestone] = useState(() => {
    return localStorage.getItem("selectedMS") || "seven";
  });

  const { data, isLoading, isError, error } = useBringMilestonesQuery();

  const handleSelectMSType = useCallback((MSType) => {
    localStorage.setItem("selectedMS", MSType);
    setViewMilestone(MSType);
  }, []);

  const filteredMilestones = data?.milestones?.filter(
    (milestone) => milestone?.milestoneType === viewMilestone
  );

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className={styles.myspacePage}>
      <Header />
      <div className={styles.myspaceContainer}>
        <div className={styles.mySpaceHeading}>
          <div className={styles.createNewMilestoneBtn}>
            <AddBtn handleOpenModal={openModal} />
          </div>
          <TakeMilestoneRequirements
            isOpen={isModalOpen}
            onClose={closeModal}
          />
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
                  {filteredMilestones?.map((milestone) => (
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
