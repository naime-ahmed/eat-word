import PropTypes from "prop-types"; // Add PropTypes for validation
import { useEffect, useRef, useState } from "react";
import { RiVolumeUpFill } from "react-icons/ri";
import { calculateTextWidth } from "../../utils";
import styles from "./SliderCard.module.css";

const SliderCard = ({ word, wordIdx }) => {
  // Initialize state with default values to avoid undefined issues
  const [wordReplica, setWordReplica] = useState({
    word: word?.word || "",
    meanings: word?.meanings || "",
    synonyms: word?.synonyms || "",
    definitions: word?.definitions || "",
    examples: word?.examples || "",
    difficultyLevel: word?.difficultyLevel || "",
    isFavorite: word?.isFavorite || false,
  });

  // Refs for auto-resizing textareas
  const wordRef = useRef(null);
  const meaningsRef = useRef(null);
  const synonymsRef = useRef(null);
  const definitionsRef = useRef(null);
  const examplesRef = useRef(null);

  // Function to auto-resize textareas
  const autoResizeTextarea = (textareaRef) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scroll height
    }
  };

  // Auto-resize textareas on mount and state change
  useEffect(() => {
    autoResizeTextarea(wordRef);
    autoResizeTextarea(meaningsRef);
    autoResizeTextarea(synonymsRef);
    autoResizeTextarea(definitionsRef);
    autoResizeTextarea(examplesRef);

    // Adjust the width of the word textarea
    if (wordRef.current) {
      const textWidth = calculateTextWidth(wordRef.current.value, "22"); // Use the utility function
      wordRef.current.style.width = `${textWidth + 22}px`; // Add padding
    }
  }, [wordReplica]);

  // Single handler for all textarea changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setWordReplica((prev) => ({ ...prev, [name]: value }));
  };

  // Destructure wordReplica for cleaner code
  const {
    word: wordText,
    meanings,
    synonyms,
    definitions,
    examples,
    difficultyLevel,
    isFavorite,
  } = wordReplica;

  return (
    <div className={styles.card}>
      <div className={styles.cardContainer}>
        {/* Word */}
        <div className={styles.cardWord}>
          <textarea
            ref={wordRef}
            name="word"
            value={wordText}
            onChange={handleOnChange}
            rows={1}
          />
          <span className={styles.wordSound} aria-label="sound">
            <RiVolumeUpFill />
          </span>
        </div>

        {/* Meanings */}
        <div className={styles.cardMeanings}>
          <label htmlFor={`meanings-${wordIdx}`}>MEANINGS: </label>
          <textarea
            ref={meaningsRef}
            name="meanings"
            id={`meanings-${wordIdx}`}
            value={meanings}
            onChange={handleOnChange}
            rows={1}
          />
        </div>

        {/* Synonyms */}
        <div className={styles.cardSynonyms}>
          <label htmlFor={`synonyms-${wordIdx}`}>SYNONYMS: </label>
          <textarea
            ref={synonymsRef}
            name="synonyms"
            id={`synonyms-${wordIdx}`}
            value={synonyms}
            onChange={handleOnChange}
            rows={1}
          />
        </div>

        {/* Definitions */}
        <div className={styles.cardDefinitions}>
          <label htmlFor={`definitions-${wordIdx}`}>DEFINITIONS: </label>
          <textarea
            ref={definitionsRef}
            name="definitions"
            id={`definitions-${wordIdx}`}
            value={definitions}
            onChange={handleOnChange}
            rows={1}
          />
        </div>

        {/* Examples */}
        <div className={styles.cardExamples}>
          <label htmlFor={`examples-${wordIdx}`}>EXAMPLES: </label>
          <textarea
            ref={examplesRef}
            name="examples"
            id={`examples-${wordIdx}`}
            value={examples}
            onChange={handleOnChange}
            rows={1}
          />
        </div>
      </div>
    </div>
  );
};

// Add PropTypes for validation
SliderCard.propTypes = {
  word: PropTypes.shape({
    addedBy: PropTypes.string,
    addedMilestone: PropTypes.string,
    contextTags: PropTypes.string,
    word: PropTypes.string,
    meanings: PropTypes.string,
    synonyms: PropTypes.string,
    definitions: PropTypes.string,
    examples: PropTypes.string,
    difficultyLevel: PropTypes.string,
    frequency: PropTypes.number,
    isFavorite: PropTypes.bool,
    learnedScore: PropTypes.number,
    memorized: PropTypes.bool,
    notes: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    _id: PropTypes.string,
    __v: PropTypes.string,
  }),
  wordIdx: PropTypes.number.isRequired,
};

// Default props to handle undefined `word`
SliderCard.defaultProps = {
  word: {
    addedBy: "",
    addedMilestone: "",
    contextTags: "",
    word: "",
    meanings: "",
    synonyms: "",
    definitions: "",
    examples: "",
    difficultyLevel: "",
    frequency: 0,
    isFavorite: false,
    learnedScore: 0,
    memorized: false,
    notes: "",
    createdAt: "",
    updatedAt: "",
    _id: "",
    __v: "0",
  },
  wordIdx: 0, // Optional: set a default for wordIdx if needed
};

export default SliderCard;
