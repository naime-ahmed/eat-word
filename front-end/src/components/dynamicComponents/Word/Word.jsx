import styles from "./Word.module.css";

const Word = ({ word, hasSynonym, hasDefinition }) => {
  return (
    <div className={styles.wordContainer}>
      <div className={styles.word}>{word?.word}</div>
      <div className={styles.meaning}>
        {word?.meanings?.map((men) => (
          <span key={men}>{men}</span>
        ))}
      </div>
      {hasSynonym && (
        <div className={styles.synonym}>
          {word?.synonyms?.map((syn) => (
            <span key={syn}>{syn}</span>
          ))}
        </div>
      )}
      {hasDefinition && (
        <div className={styles.engDefinition}>
          {word?.definitions?.map((def) => (
            <span key={def}>{def}</span>
          ))}
        </div>
      )}
      <div className={styles.exmInSen}>
        {word?.examples?.map((exp) => (
          <span key={exp}>{exp}</span>
        ))}
      </div>
    </div>
  );
};

export default Word;
