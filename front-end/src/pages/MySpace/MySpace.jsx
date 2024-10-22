import { useState } from "react";

import TakeMilestoneRequirements from "../../components/popups/milestoneRequirements/milestoneRequirements";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./MySpace.module.css";

const MySpace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewChallenge, setViewChallenge] = useState("seven");

  const { data, isLoading, isError, Error } = useBringMilestonesQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    console.log(Error);
    return <p>something went wrong</p>;
  }
  console.log(data);
  const filteredChallenges = data?.milestones?.filter(
    (challenge) => challenge.challengeType === viewChallenge
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
        <div className={styles.mySpaceContent}>
          <div className={styles.tabs}>
            <ul>
              <li
                onClick={() => setViewChallenge("seven")}
                className={viewChallenge === "seven" ? styles.active : ""}
              >
                7-Day challenges
              </li>
              <li
                onClick={() => setViewChallenge("three")}
                className={viewChallenge === "three" ? styles.active : ""}
              >
                3-Day Challenges
              </li>
              <li
                onClick={() => setViewChallenge("zero")}
                className={viewChallenge === "zero" ? styles.active : ""}
              >
                Flexible Learning
              </li>
            </ul>
          </div>
          <div className="challenges">
            {filteredChallenges.length === 0 ? (
              <p>You have not taken challenge yet</p>
            ) : (
              <div>
                {filteredChallenges.map((challenge) => (
                  <p key={challenge._id}>
                    {challenge.name} {challenge.challengeType}
                  </p>
                ))}
              </div>
            )}
            {}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MySpace;

{
  /* <div className={styles.sevenDayChallenge}>
            <div className={styles.sevenDayHeading}>
              <h3>7 Days Challenges</h3>
            </div>
            <div className={styles.sevenDayContent}>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMainContent}>
                  <div className={styles.milestoneNum}>
                    <p>milestone 00000000000000000000001</p>
                  </div>
                  <div className={styles.wordVerdict}>
                    <p title="Memorized">39</p>
                    <p title="Required revision">11</p>
                  </div>
                </div>
                <p className={styles.milestoneCardLastEdit}>
                  Last Touched: 17th oct 24
                </p>
              </div>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMainContent}>
                  <div className={styles.milestoneNum}>
                    <p>milestone 01</p>
                  </div>
                  <div className={styles.wordVerdict}>
                    <p title="Memorized">39</p>
                    <p title="Required revision">11</p>
                  </div>
                </div>
                <p className={styles.milestoneCardLastEdit}>
                  Last Touched: 17th oct 24
                </p>
              </div>
            </div>
          </div>
          <div className={styles.threeDayChallenge}>
            <div className={styles.threeDayHeading}>
              <h3>3 Days Challenges</h3>
            </div>
            <div className={styles.threeDayContent}>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMainContent}>
                  <div className={styles.milestoneNum}>
                    <p>milestone 01</p>
                  </div>
                  <div className={styles.wordVerdict}>
                    <p title="Memorized">39</p>
                    <p title="Required revision">11</p>
                  </div>
                </div>
                <p className={styles.milestoneCardLastEdit}>
                  Last Touched: 17th oct 24
                </p>
              </div>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMainContent}>
                  <div className={styles.milestoneNum}>
                    <p>milestone 01</p>
                  </div>
                  <div className={styles.wordVerdict}>
                    <p title="Memorized">39</p>
                    <p title="Required revision">11</p>
                  </div>
                </div>
                <p className={styles.milestoneCardLastEdit}>
                  Last Touched: 17th oct 24
                </p>
              </div>
            </div>
          </div>
          <div className={styles.flexibleLearning}>
            <div className={styles.flexibleLHeading}>
              <h3>Flexible Learning</h3>
            </div>
            <div className={styles.flexibleLContent}>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMainContent}>
                  <div className={styles.milestoneNum}>
                    <p>milestone 01</p>
                  </div>
                  <div className={styles.wordVerdict}>
                    <p title="Memorized">39</p>
                    <p title="Required revision">11</p>
                  </div>
                </div>
                <p className={styles.milestoneCardLastEdit}>
                  Last Touched: 17th oct 24
                </p>
              </div>
              <div className={styles.milestoneCard}>
                <div className={styles.milestoneMainContent}>
                  <div className={styles.milestoneNum}>
                    <p>milestone 01</p>
                  </div>
                  <div className={styles.wordVerdict}>
                    <p title="Memorized">39</p>
                    <p title="Required revision">11</p>
                  </div>
                </div>
                <p className={styles.milestoneCardLastEdit}>
                  Last Touched: 17th oct 24
                </p>
              </div>
            </div>
          </div> */
}
