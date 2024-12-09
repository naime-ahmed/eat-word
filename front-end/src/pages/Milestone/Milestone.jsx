import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MilestoneDeadline from "../../components/dynamicComponents/MilestoneDeadline/MilestoneDeadline";
import Word from "../../components/dynamicComponents/Word/Word";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import { useBringMilestonesQuery } from "../../services/milestone";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const { user } = useSelector((state) => state.auth);
  const { milestoneId } = useParams();
  const { data, isLoading, isError, error } = useBringMilestonesQuery();
  console.log(user);
  // State for milestone name
  const [milestoneName, setMilestoneName] = useState("");

  const curMilestone = data?.milestones?.filter(
    (milestone) => milestone._id === milestoneId
  )[0];

  let duration = 7;
  if (curMilestone?.milestoneType === "three") {
    duration = 3;
  }
  console.log("curr Milestone", curMilestone);

  // Set initial milestone name when data is loaded
  useEffect(() => {
    if (curMilestone?.name) {
      setMilestoneName(curMilestone.name);
    }
  }, [curMilestone]);

  // Handle input change
  const handleNameChange = (e) => {
    setMilestoneName(e.target.value);
    // Here implement throttled server update
    // Example: throttledUpdateServer(e.target.value);
  };

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
                <div className={styles.milestoneName}>
                  <input
                    type="text"
                    name="milestoneName"
                    value={milestoneName}
                    onChange={handleNameChange}
                    className={styles.milestoneNameInput}
                  />
                </div>
                <div className={styles.milestoneTimeLeft}>
                  <MilestoneDeadline
                    createdAt={curMilestone.createdAt}
                    duration={duration}
                  />
                </div>
              </div>

              <div className={styles.divider}></div>
              <div className={styles.milestoneWords}>
                <div className={styles.wordsHeading}>
                  <div className={styles.wordColumn}>Word</div>
                  <div className={styles.meaningColumn}>Meaning</div>
                  {curMilestone.learnSynonyms && (
                    <div className={styles.synonymColumn}>Synonyms</div>
                  )}
                  {curMilestone.includeDefinition && (
                    <div className={styles.engDefinitionColumn}>
                      English Definition
                    </div>
                  )}
                  <div className={styles.exmInSenColumn}>
                    Example in a sentence
                  </div>
                </div>
                <div className={styles.words}>
                  <Word
                    hasSynonym={Boolean(curMilestone.learnSynonyms)}
                    hasDefinition={Boolean(curMilestone.includeDefinition)}
                  />
                  <Word
                    hasSynonym={Boolean(curMilestone.learnSynonyms)}
                    hasDefinition={Boolean(curMilestone.includeDefinition)}
                  />
                  <Word
                    hasSynonym={Boolean(curMilestone.learnSynonyms)}
                    hasDefinition={Boolean(curMilestone.includeDefinition)}
                  />
                  <Word
                    hasSynonym={Boolean(curMilestone.learnSynonyms)}
                    hasDefinition={Boolean(curMilestone.includeDefinition)}
                  />
                  <Word
                    hasSynonym={Boolean(curMilestone.learnSynonyms)}
                    hasDefinition={Boolean(curMilestone.includeDefinition)}
                  />
                  <Word
                    hasSynonym={Boolean(curMilestone.learnSynonyms)}
                    hasDefinition={Boolean(curMilestone.includeDefinition)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Milestone;
