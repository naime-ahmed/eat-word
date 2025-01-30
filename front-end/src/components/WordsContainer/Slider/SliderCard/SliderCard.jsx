import { useCallback, useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiVolumeUpFill } from "react-icons/ri";
import { debounceUpdate } from "../../../../utils/debounceUpdate";
import { sliderCardPropTypes } from "../../../../utils/propTypes";
import Notification from "../../../Notification/Notification";
import Popup from "../../../Popup/Popup";
import TableRowMenu from "../../../Popup/PopUpContents/TableRowMenu/TableRowMenu";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import { useUpdateWords } from "../../hooks/useUpdateWords";
import { calculateTextWidth } from "../../utils";
import styles from "./SliderCard.module.css";

const CHARACTER_LIMITS = {
  word: 20,
  meanings: 100,
  synonyms: 100,
  definitions: 250,
  examples: 255,
};

const SliderCard = ({
  word,
  setWords,
  wordIdx,
  curMilestone,
  isOnRecallMood,
}) => {
  // Initialize state with default values to avoid undefined issues
  const [wordReplica, setWordReplica] = useState({
    word: word?.word || "",
    meanings: word?.meanings || "",
    synonyms: word?.synonyms || "",
    definitions: word?.definitions || "",
    examples: word?.examples || "",
  });

  // Destructure wordReplica for cleaner code
  const {
    word: wordText,
    meanings,
    synonyms,
    definitions,
    examples,
  } = wordReplica;

  // Add state for showing limit messages
  const [limitMessageField, setLimitMessageField] = useState(null);

  // Add state for dismissed blur fields
  const [dismissedBlurFields, setDismissedBlurFields] = useState({
    meanings: false,
    synonyms: false,
    definitions: false,
    examples: false,
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
        calculateTextWidth(wordRef.current.value, "20px")
      );
      wordRef.current.style.width = `${textWidth + 14}px`;
    }
  }, [wordReplica]);

  // Reset dismissal when recall mode ends
  useEffect(() => {
    if (!isOnRecallMood) {
      setDismissedBlurFields({
        meanings: false,
        synonyms: false,
        definitions: false,
        examples: false,
      });
    }
  }, [isOnRecallMood]);

  // Handle blur dismissal
  const handleBlurDismiss = (fieldName) => {
    setDismissedBlurFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

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
      if (value === word[name]) {
        return;
      }
      handleUpdateWords(wordIdx, name, value);
    }, 1000)
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
    const limit = CHARACTER_LIMITS[name] || Infinity;
    const slicedValue = value.slice(0, limit);

    setWordReplica((prev) => ({ ...prev, [name]: slicedValue }));
    debouncedUpdateRef.current(name, slicedValue);

    if (value.length >= limit) {
      setLimitMessageField(name);
      setTimeout(() => setLimitMessageField(null), 2000);
    }
  }, []);

  // handle menu
  const handleShowMenu = (e) => {
    if (showMenu) {
      setShowMenu(false);
    } else {
      // Calculate click position with scroll offset
      const x = e.clientX + window.scrollX;
      const y = e.clientY + window.scrollY;
      setClickPosition({ x, y });
      setShowMenu(true);
    }
  };
  const handleMenuClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  // handle text-to-speech
  const { speckText, speechError, notifySpeechError, setNotifySpeechError } =
    useTextToSpeech();
  const handleSpeckText = (text) => {
    speckText(text);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContainer}>
        {/* Word */}
        <div className={styles.cardWord}>
          <div className={styles.textareaWrapper}>
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
              <span
                className={styles.wordSound}
                aria-label="sound"
                onClick={() => handleSpeckText(wordText)}
                role="button"
                tabIndex={0}
              >
                <RiVolumeUpFill />
              </span>
            )}
            {notifySpeechError && (
              <Notification
                title="Failed to utter!"
                message={speechError}
                iconType="error"
                isOpen={notifySpeechError}
                onClose={() => setNotifySpeechError(false)}
              />
            )}
            {limitMessageField === "word" && (
              <div className={styles.limitMessage}>
                Maximum {CHARACTER_LIMITS.word} characters
              </div>
            )}
          </div>
        </div>

        {/* Meanings Section Example */}
        <div className={styles.cardMeanings}>
          <label htmlFor={`meanings-${wordIdx}`}>MEANINGS: </label>
          <div
            className={`${styles.textareaWrapper} ${
              isOnRecallMood && !dismissedBlurFields.meanings && meanings
                ? styles.blurred
                : ""
            }`}
            onClick={(e) => {
              if (isOnRecallMood && !dismissedBlurFields.meanings && meanings) {
                e.preventDefault();
                handleBlurDismiss("meanings");
              } else {
                meaningsRef.current?.focus();
              }
            }}
          >
            <textarea
              ref={meaningsRef}
              name="meanings"
              id={`meanings-${wordIdx}`}
              value={meanings}
              onChange={handleOnChange}
              className={`${meanings ? "" : styles.empty}`}
              rows={1}
              onFocus={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.meanings &&
                  meanings
                ) {
                  e.target.blur();
                }
              }}
            />
            {isOnRecallMood && !dismissedBlurFields.meanings && meanings && (
              <div className={styles.blurOverlay} />
            )}
          </div>
          {limitMessageField === "meanings" && (
            <div className={styles.limitMessage}>
              Maximum {CHARACTER_LIMITS.meanings} characters
            </div>
          )}
        </div>

        {/* Synonyms Section */}
        {curMilestone?.learnSynonyms && (
          <div className={styles.cardSynonyms}>
            <label htmlFor={`synonyms-${wordIdx}`}>SYNONYMS: </label>
            <div
              className={`${styles.textareaWrapper} ${
                isOnRecallMood && !dismissedBlurFields.synonyms && synonyms
                  ? styles.blurred
                  : ""
              }`}
              onClick={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.synonyms &&
                  synonyms
                ) {
                  e.preventDefault();
                  handleBlurDismiss("synonyms");
                } else {
                  synonymsRef.current?.focus();
                }
              }}
            >
              <textarea
                ref={synonymsRef}
                name="synonyms"
                id={`synonyms-${wordIdx}`}
                value={synonyms}
                onChange={handleOnChange}
                className={`${synonyms ? "" : styles.empty}`}
                rows={1}
                onFocus={(e) => {
                  if (
                    isOnRecallMood &&
                    !dismissedBlurFields.synonyms &&
                    synonyms
                  ) {
                    e.target.blur();
                  }
                }}
              />
              {isOnRecallMood && !dismissedBlurFields.synonyms && synonyms && (
                <div className={styles.blurOverlay} />
              )}
            </div>
            {limitMessageField === "synonyms" && (
              <div className={styles.limitMessage}>
                Maximum {CHARACTER_LIMITS.synonyms} characters
              </div>
            )}
          </div>
        )}

        {/* Definitions */}
        {curMilestone?.includeDefinition && (
          <div className={styles.cardDefinitions}>
            <label htmlFor={`definitions-${wordIdx}`}>DEFINITIONS: </label>
            <div
              className={`${styles.textareaWrapper} ${
                isOnRecallMood &&
                !dismissedBlurFields.definitions &&
                definitions
                  ? styles.blurred
                  : ""
              }`}
              onClick={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.definitions &&
                  definitions
                ) {
                  e.preventDefault();
                  handleBlurDismiss("definitions");
                } else {
                  definitionsRef.current?.focus();
                }
              }}
            >
              <textarea
                ref={definitionsRef}
                name="definitions"
                id={`definitions-${wordIdx}`}
                value={definitions}
                onChange={handleOnChange}
                className={`${definitions ? "" : styles.empty}`}
                rows={1}
                onFocus={(e) => {
                  if (
                    isOnRecallMood &&
                    !dismissedBlurFields.definitions &&
                    definitions
                  ) {
                    e.target.blur();
                  }
                }}
              />
              {isOnRecallMood &&
                !dismissedBlurFields.definitions &&
                definitions && <div className={styles.blurOverlay} />}
            </div>
            {limitMessageField === "definitions" && (
              <div className={styles.limitMessage}>
                Maximum {CHARACTER_LIMITS.definitions} characters
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        <div className={styles.cardExamples}>
          <label htmlFor={`examples-${wordIdx}`}>EXAMPLES: </label>
          <div
            className={`${styles.textareaWrapper} ${
              isOnRecallMood && !dismissedBlurFields.examples && examples
                ? styles.blurred
                : ""
            }`}
            onClick={(e) => {
              if (isOnRecallMood && !dismissedBlurFields.examples && examples) {
                e.preventDefault();
                handleBlurDismiss("examples");
              } else {
                examplesRef.current?.focus();
              }
            }}
          >
            <textarea
              ref={examplesRef}
              name="examples"
              id={`examples-${wordIdx}`}
              value={examples}
              onChange={handleOnChange}
              className={`${examples ? "" : styles.empty}`}
              rows={1}
              onFocus={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.examples &&
                  examples
                ) {
                  e.target.blur();
                }
              }}
            />
            {isOnRecallMood && !dismissedBlurFields.examples && examples && (
              <div className={styles.blurOverlay} />
            )}
          </div>
          {limitMessageField === "examples" && (
            <div className={styles.limitMessage}>
              Maximum {CHARACTER_LIMITS.examples} characters
            </div>
          )}
        </div>
      </div>
      <span className={styles.cardMenu} onClick={handleShowMenu}>
        <BiDotsVerticalRounded />
        {/* show word menu */}
        {showMenu && (
          <Popup
            isOpen={showMenu}
            onClose={handleMenuClose}
            showCloseButton={false}
            clickPosition={clickPosition}
            popupType="menu"
          >
            <TableRowMenu curWord={word} onClose={handleMenuClose} />
          </Popup>
        )}
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
