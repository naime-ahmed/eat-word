import { useState } from "react";

import TakeMilestoneRequirements from "../../components/popups/milestoneRequirements/milestoneRequirements";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import AddBtn from "../../components/ui/button/AddBtn/AddBtn";
import styles from "./MySpace.module.css";

const MySpace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className={styles.sevenDayChallenge}>
            <div className={styles.sevenDayHeading}>
              <h3>7 Days Challenges</h3>
            </div>
            <div className={styles.sevenDayContent}>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MySpace;
