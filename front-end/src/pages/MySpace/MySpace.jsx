import { useState } from "react";

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
  const [viewMilestone, setViewMilestone] = useState("seven");

  const { data, isLoading, isError, error } = useBringMilestonesQuery();

  if (isError) {
    console.log("error", error);
  }
  console.log(data);
  const filteredMilestones = data?.milestones?.filter(
    (milestone) => milestone?.milestoneType === viewMilestone
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          <Error error={error}></Error>
        ) : (
          <div className={styles.mySpaceContent}>
            <div className={styles.tabs}>
              <ul>
                <li
                  onClick={() => setViewMilestone("seven")}
                  className={viewMilestone === "seven" ? styles.active : ""}
                >
                  7-Day challenges
                </li>
                <li
                  onClick={() => setViewMilestone("three")}
                  className={viewMilestone === "three" ? styles.active : ""}
                >
                  3-Day Challenges
                </li>
                <li
                  onClick={() => setViewMilestone("zero")}
                  className={viewMilestone === "zero" ? styles.active : ""}
                >
                  Flexible Learning
                </li>
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
