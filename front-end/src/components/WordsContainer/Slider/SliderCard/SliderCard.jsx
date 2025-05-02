import { useCallback, useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiVolumeUpFill } from "react-icons/ri";
import { debounceUpdate } from "../../../../utils/debounceUpdate";
import { sliderCardPropTypes } from "../../../../utils/propTypes";
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
  generatingCells,
  setGeneratingCells,
  setGenAILimit,
}) => {
  const [wordReplica, setWordReplica] = useState(() => ({
    word: word?.word || "",
    meanings: word?.meanings || "",
    synonyms: word?.synonyms || "",
    definitions: word?.definitions || "",
    examples: word?.examples || "",
  }));

  useEffect(() => {
    setWordReplica({
      word: word?.word || "",
      meanings: word?.meanings || "",
      synonyms: word?.synonyms || "",
      definitions: word?.definitions || "",
      examples: word?.examples || "",
    });

    // Reset textarea sizes when word updates
    const textareas = [
      wordRef,
      meaningsRef,
      synonymsRef,
      definitionsRef,
      examplesRef,
    ];
    textareas.forEach((ref) => {
      if (ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    });
  }, [word]);

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

  const { updateWords } = useUpdateWords();

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
  const { speckText } = useTextToSpeech();
  const handleSpeckText = (text) => {
    speckText(text);
  };

  const isGenerating = useCallback(
    (columnId) =>
      generatingCells.some(([r, c]) => r === wordIdx && c === columnId),
    [generatingCells, wordIdx]
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardContainer}>
        {/* Word */}
        <div className={styles.cardWord}>
          <div className={styles.textareaWrapper}>
            <textarea
              ref={wordRef}
              name="word"
              value={wordReplica.word}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              placeholder="Your Word"
              className={`${wordReplica.word ? "" : styles.empty} ${
                word.difficultyLevel === "hard" ? styles.itsHard : ""
              }`}
              rows={1}
            />
            {wordReplica.word && (
              <span
                className={styles.wordSound}
                aria-label="sound"
                onClick={() => handleSpeckText(wordReplica.word)}
                role="button"
                tabIndex={0}
              >
                <RiVolumeUpFill />
              </span>
            )}
            {limitMessageField === "word" && (
              <div className={styles.limitMessage}>
                Maximum {CHARACTER_LIMITS.word} characters
              </div>
            )}
          </div>
        </div>

        {/* Meanings Section*/}
        <div className={styles.cardMeanings}>
          <label htmlFor={`meanings-${wordIdx}`}>
            {curMilestone.comfortableLang.toUpperCase()} MEANINGS:
          </label>
          <div
            className={`${styles.textareaWrapper} ${
              isOnRecallMood &&
              !dismissedBlurFields.meanings &&
              wordReplica.meanings
                ? styles.blurred
                : ""
            } ${isGenerating("meanings") ? styles.generating : ""} `}
            onClick={(e) => {
              if (
                isOnRecallMood &&
                !dismissedBlurFields.meanings &&
                wordReplica.meanings
              ) {
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
              value={wordReplica.meanings}
              onChange={handleOnChange}
              className={`${wordReplica.meanings ? "" : styles.empty} ${
                isGenerating("meanings") ? styles.pulsingText : ""
              } `}
              rows={1}
              onFocus={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.meanings &&
                  wordReplica.meanings
                ) {
                  e.target.blur();
                }
              }}
            />
            {isOnRecallMood &&
              !dismissedBlurFields.meanings &&
              wordReplica.meanings && (
                <div className={styles.blurOverlay}>Click to revel</div>
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
                isOnRecallMood &&
                !dismissedBlurFields.synonyms &&
                wordReplica.synonyms
                  ? styles.blurred
                  : ""
              } ${isGenerating("synonyms") ? styles.generating : ""}`}
              onClick={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.synonyms &&
                  wordReplica.synonyms
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
                value={wordReplica.synonyms}
                onChange={handleOnChange}
                className={`${wordReplica.synonyms ? "" : styles.empty} ${
                  isGenerating("synonyms") ? styles.pulsingText : ""
                }`}
                rows={1}
                onFocus={(e) => {
                  if (
                    isOnRecallMood &&
                    !dismissedBlurFields.synonyms &&
                    wordReplica.synonyms
                  ) {
                    e.target.blur();
                  }
                }}
              />
              {isOnRecallMood &&
                !dismissedBlurFields.synonyms &&
                wordReplica.synonyms && (
                  <div className={styles.blurOverlay}>Click to revel</div>
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
                wordReplica.definitions
                  ? styles.blurred
                  : ""
              } ${isGenerating("definitions") ? styles.generating : ""} `}
              onClick={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.definitions &&
                  wordReplica.definitions
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
                value={wordReplica.definitions}
                onChange={handleOnChange}
                className={`${wordReplica.definitions ? "" : styles.empty} ${
                  isGenerating("definitions") ? styles.pulsingText : ""
                } `}
                rows={1}
                onFocus={(e) => {
                  if (
                    isOnRecallMood &&
                    !dismissedBlurFields.definitions &&
                    wordReplica.definitions
                  ) {
                    e.target.blur();
                  }
                }}
              />
              {isOnRecallMood &&
                !dismissedBlurFields.definitions &&
                wordReplica.definitions && (
                  <div className={styles.blurOverlay}>Click to revel</div>
                )}
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
              isOnRecallMood &&
              !dismissedBlurFields.examples &&
              wordReplica.examples
                ? styles.blurred
                : ""
            } ${isGenerating("examples") ? styles.generating : ""}`}
            onClick={(e) => {
              if (
                isOnRecallMood &&
                !dismissedBlurFields.examples &&
                wordReplica.examples
              ) {
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
              value={wordReplica.examples}
              onChange={handleOnChange}
              className={`${wordReplica.examples ? "" : styles.empty} ${
                isGenerating("examples") ? styles.pulsingText : ""
              } `}
              rows={1}
              onFocus={(e) => {
                if (
                  isOnRecallMood &&
                  !dismissedBlurFields.examples &&
                  wordReplica.examples
                ) {
                  e.target.blur();
                }
              }}
            />
            {isOnRecallMood &&
              !dismissedBlurFields.examples &&
              wordReplica.examples && (
                <div className={styles.blurOverlay}>Click to revel</div>
              )}
          </div>
          {limitMessageField === "examples" && (
            <div className={styles.limitMessage}>
              Maximum {CHARACTER_LIMITS.examples} characters
            </div>
          )}
        </div>
      </div>
      {word._id && (
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
              <TableRowMenu
                curWord={word}
                rowIdx={wordIdx}
                onClose={handleMenuClose}
                setGeneratingCells={setGeneratingCells}
                learningLang={curMilestone.learningLang}
                comfortableLang={curMilestone.comfortableLang}
                includeDefinition={curMilestone.includeDefinition}
                learnSynonyms={curMilestone.learnSynonyms}
                setGenAILimit={setGenAILimit}
              />
            </Popup>
          )}
        </span>
      )}
    </div>
  );
};

// Add PropTypes for validation
SliderCard.propTypes = sliderCardPropTypes;

export default SliderCard;
