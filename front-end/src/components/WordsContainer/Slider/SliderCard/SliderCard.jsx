import { useCallback, useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiVolumeUpFill } from "react-icons/ri";
import { debounceUpdate } from "../../../../utils/debounceUpdate";
import { sliderCardPropTypes } from "../../../../utils/propTypes";
import Notification from "../../../Notification/Notification";
import Popup from "../../../Popup/Popup";
import TableRowMenu from "../../../Popup/PopUpContents/TableRowMenu/TableRowMenu";
import { useUpdateWords } from "../../hooks/useUpdateWords";
import { calculateTextWidth } from "../../utils";
import styles from "./SliderCard.module.css";
const SliderCard = ({ word, setWords, wordIdx, curMilestone }) => {
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

  const [clickPosition, setClickPosition] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Refs for auto-resizing textareas
  const wordRef = useRef(null);
  const meaningsRef = useRef(null);
  const synonymsRef = useRef(null);
  const definitionsRef = useRef(null);
  const examplesRef = useRef(null);

  const { updateWords, missingError, doNotify, setDoNotify } = useUpdateWords();

  // Function to auto-resize textareas
  const autoResizeTextarea = (textareaRef) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Auto-resize textareas on mount and state change
  useEffect(() => {
    // Auto-resize all textareas
    const textareas = [
      wordRef,
      meaningsRef,
      synonymsRef,
      definitionsRef,
      examplesRef,
    ];
    textareas.forEach((ref) => autoResizeTextarea(ref));

    // Adjust the width of the word textarea
    if (wordRef.current) {
      const textWidth = Math.max(
        110,
        calculateTextWidth(wordRef.current.value, "24px")
      );
      wordRef.current.style.width = `${textWidth + 14}px`;
      console.log(wordRef.current.value, "width: ", textWidth);
    }
  }, [wordReplica]);

  // Prevent Enter key from creating a new line
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleUpdateWords = (wordIdx, property, value) => {
    try {
      updateWords(setWords, wordIdx, property, value, curMilestone?._id);
    } catch (error) {
      console.log("error on edit word (slide): ", error);
    }
  };

  // Memoize the debounced function using useRef
  const debouncedUpdateRef = useRef(
    debounceUpdate((name, value) => {
      // incase value is same, we don't need to call server
      if (value === word[name]) {
        return;
      }
      handleUpdateWords(wordIdx, name, value);
    }, 500)
  );

  // Cleanup debounce ref on unmount
  useEffect(() => {
    const debounceRef = debouncedUpdateRef.current;
    return () => {
      debounceRef.cancel();
    };
  }, []);

  // Single handler for all textarea changes
  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;

    // Update local state immediately
    setWordReplica((prev) => ({ ...prev, [name]: value }));

    // call server to update on db
    debouncedUpdateRef.current(name, value);
  }, []);

  // handle menu
  const handleShowMenu = (e) => {
    console.log("show menu clicked");
    // Calculate click position with scroll offset
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    setClickPosition({ x, y });
    setShowMenu(true);
  };
  const handleMenuClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  // Destructure wordReplica for cleaner code
  const {
    word: wordText,
    meanings,
    synonyms,
    definitions,
    examples,
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
            onKeyDown={handleKeyDown}
            placeholder="Your Word"
            className={`${wordText ? "" : styles.empty}`}
            rows={1}
          />
          {wordText && (
            <span className={styles.wordSound} aria-label="sound">
              <RiVolumeUpFill />
            </span>
          )}
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
            className={`${meanings ? "" : styles.empty}`}
            rows={1}
          />
        </div>

        {/* Synonyms */}
        {curMilestone?.learnSynonyms && (
          <div className={styles.cardSynonyms}>
            <label htmlFor={`synonyms-${wordIdx}`}>SYNONYMS: </label>
            <textarea
              ref={synonymsRef}
              name="synonyms"
              id={`synonyms-${wordIdx}`}
              value={synonyms}
              onChange={handleOnChange}
              className={`${synonyms ? "" : styles.empty}`}
              rows={1}
            />
          </div>
        )}

        {/* Definitions */}
        {curMilestone?.includeDefinition && (
          <div className={styles.cardDefinitions}>
            <label htmlFor={`definitions-${wordIdx}`}>DEFINITIONS: </label>
            <textarea
              ref={definitionsRef}
              name="definitions"
              id={`definitions-${wordIdx}`}
              value={definitions}
              onChange={handleOnChange}
              className={`${definitions ? "" : styles.empty}`}
              rows={1}
            />
          </div>
        )}

        {/* Examples */}
        <div className={styles.cardExamples}>
          <label htmlFor={`examples-${wordIdx}`}>EXAMPLES: </label>
          <textarea
            ref={examplesRef}
            name="examples"
            id={`examples-${wordIdx}`}
            value={examples}
            onChange={handleOnChange}
            className={`${examples ? "" : styles.empty}`}
            rows={1}
          />
        </div>
      </div>
      <span className={styles.cardMenu} onClick={handleShowMenu}>
        <BiDotsVerticalRounded />
        {/* show word menu */}
        <Popup
          isOpen={showMenu}
          onClose={handleMenuClose}
          showCloseButton={false}
          clickPosition={clickPosition}
          popupType="menu"
        >
          <TableRowMenu curWord={word} onClose={handleMenuClose} />
        </Popup>
      </span>

      {/* show notification */}
      {doNotify && (
        <Notification
          title="Failed to update!"
          message={missingError}
          iconType="warning"
          isOpen={doNotify}
          onClose={() => setDoNotify(false)}
          duration={5000}
        />
      )}
    </div>
  );
};

// Add PropTypes for validation
SliderCard.propTypes = sliderCardPropTypes;

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
    __v: 0,
  },
  setWords: () => {},
  wordIdx: 0,
  curMilestone: {},
};

export default SliderCard;
