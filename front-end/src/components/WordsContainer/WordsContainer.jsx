import { useBringMilestoneWordQuery } from "../../services/milestone";
import Word from "../dynamicComponents/Word/Word";
import Error from "../shared/Error/Error";
import styles from "./WordsContainer.module.css";

const WordsContainer = ({ curMilestone }) => {
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );
  const words = data?.words;
  console.log(words);

  return (
    <div className={styles.WordsContainer}>
      <div className={styles.milestoneWords}>
        <MilestoneHeading curMilestone={curMilestone} />
        {isLoading ? (
          "Loading..."
        ) : isError ? (
          <Error error={error} />
        ) : (
          <div className={styles.words}>
            {words &&
              words.map((word) => (
                <Word
                  key={word.id}
                  word={word}
                  hasSynonym={curMilestone?.learnSynonyms}
                  hasDefinition={curMilestone?.includeDefinition}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// milestone header
const MilestoneHeading = ({ curMilestone }) => {
  console.log("insideHead", curMilestone);
  return (
    <div className={styles.wordsHeading}>
      <div className={styles.wordColumn}>Word</div>
      <div className={styles.meaningColumn}>Meaning</div>
      {curMilestone?.learnSynonyms && (
        <div className={styles.synonymColumn}>Synonyms</div>
      )}
      {curMilestone?.includeDefinition && (
        <div className={styles.engDefinitionColumn}>English Definition</div>
      )}
      <div className={styles.exmInSenColumn}>Example in a sentence</div>
    </div>
  );
};

export default WordsContainer;
