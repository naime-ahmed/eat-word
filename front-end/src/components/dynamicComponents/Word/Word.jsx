import styles from "./Word.module.css";

const Word = ({ hasSynonym, hasDefinition }) => {
  return (
    <div className={styles.wordContainer}>
      <div className={styles.word}>Word</div>
      <div className={styles.meaning}>Meaning</div>
      {hasSynonym && <div className={styles.synonym}>Synonyms</div>}
      {hasDefinition && (
        <div className={styles.engDefinition}>English Definition</div>
      )}
      <div className={styles.exmInSen}>Example in a sentence</div>
    </div>
  );
};

export default Word;
