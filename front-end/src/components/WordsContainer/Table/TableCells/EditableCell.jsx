import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePreviousState } from "../../hooks/usePreviousState";
import styles from "./EditableCell.module.css";

const CHARACTER_LIMITS = {
  word: 35,
  meanings: 100,
  synonyms: 100,
  definitions: 250,
  examples: 255,
};

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);
  const hasFocusedRef = useRef(false);
  const [isBlurDismissed, setIsBlurDismissed] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const characterLimitTimeoutRef = useRef(null);

  const isCurrentlyGenerating = table.options.meta?.generatingCells.some(
    ([rowIdx, colId]) => rowIdx === row.index && colId === column.id
  );

  const characterLimit = CHARACTER_LIMITS[column.id] || 0;
  const isOnRecallMode = table.options.meta?.isOnRecallMood;

  const isRecallBlurActive =
    isOnRecallMode && column.id !== "word" && !isBlurDismissed && !!value;

  const cellShouldBeVisuallyBlurred =
    isRecallBlurActive || isCurrentlyGenerating;
  const prevCellShouldBeVisuallyBlurred = usePreviousState(
    cellShouldBeVisuallyBlurred
  );

  const [blurAnimationState, setBlurAnimationState] = useState("none");
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      if (cellShouldBeVisuallyBlurred) {
        setBlurAnimationState("static");
        setBlurAnimationState("none");
      }
      isFirstRenderRef.current = false;
      return;
    }

    // Not first render
    if (cellShouldBeVisuallyBlurred) {
      if (!prevCellShouldBeVisuallyBlurred) {
        setBlurAnimationState("blurring");
      } else {
        if (blurAnimationState === "unblurring") {
          setBlurAnimationState("blurring");
        } else if (blurAnimationState === "none") {
          setBlurAnimationState("blurring");
        }
      }
    } else {
      // cellShouldBeVisuallyBlurred is FALSE
      if (prevCellShouldBeVisuallyBlurred) {
        setBlurAnimationState("unblurring");
      } else {
        if (blurAnimationState === "blurring") {
          setBlurAnimationState("unblurring");
        } else if (blurAnimationState === "static") {
          setBlurAnimationState("unblurring");
        }
      }
    }
  }, [
    cellShouldBeVisuallyBlurred,
    prevCellShouldBeVisuallyBlurred,
    blurAnimationState,
  ]);

  const handleAnimationEnd = () => {
    if (blurAnimationState === "blurring") {
      setBlurAnimationState("static");
    } else if (blurAnimationState === "unblurring") {
      setBlurAnimationState("none");
    }
  };

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      table.options.meta?.updateRowHeight(
        row.index,
        column.id,
        textarea.scrollHeight,
        "update"
      );
    }
  }, [row.index, table, column.id]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${
        table.options.meta?.rowHeights[row.index]?.curMax ||
        textarea.scrollHeight
      }px`;
    }
  }, [row.index, table.options.meta?.rowHeights]);

  useEffect(() => {
    const handleZoom = () => requestAnimationFrame(adjustHeight);
    const zoomHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-")) {
        handleZoom();
      }
    };
    window.addEventListener("keydown", zoomHandler);
    window.visualViewport?.addEventListener("resize", handleZoom);
    return () => {
      window.removeEventListener("keydown", zoomHandler);
      window.visualViewport?.removeEventListener("resize", handleZoom);
      clearTimeout(characterLimitTimeoutRef.current);
    };
  }, [adjustHeight]);

  useEffect(() => {
    setValue(initialValue);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        adjustHeight();
      }
    });
  }, [initialValue, adjustHeight]);

  useEffect(() => {
    if (
      column.id === "word" &&
      !row.original._id &&
      !hasFocusedRef.current &&
      textareaRef.current &&
      !cellShouldBeVisuallyBlurred
    ) {
      textareaRef.current.focus();
      hasFocusedRef.current = true;
    }
  }, [column.id, row.original._id, cellShouldBeVisuallyBlurred]);

  useEffect(() => {
    if (!isOnRecallMode) {
      setIsBlurDismissed(false);
    }
  }, [isOnRecallMode]);

  const handleOnChange = (e) => {
    const newValue = e.target.value.slice(0, characterLimit);
    setValue(newValue);
    if (e.target.value.length >= characterLimit && characterLimit > 0) {
      setShowLimitMessage(true);
      clearTimeout(characterLimitTimeoutRef.current);
      characterLimitTimeoutRef.current = setTimeout(
        () => setShowLimitMessage(false),
        2000
      );
    } else {
      setShowLimitMessage(false);
      clearTimeout(characterLimitTimeoutRef.current);
    }
    adjustHeight();
  };

  const handleOnBlur = useCallback(() => {
    if (initialValue !== value) {
      table.options.meta?.updateWords(row.index, column.id, value);
    }
  }, [initialValue, value, row.index, column.id, table.options.meta]);

  const handleOverlayClick = (e) => {
    if (isRecallBlurActive) {
      e.preventDefault();
      setIsBlurDismissed(true);
      return;
    }
    if (
      !isCurrentlyGenerating &&
      blurAnimationState !== "blurring" &&
      blurAnimationState !== "static"
    ) {
      textareaRef.current?.focus();
    }
  };

  const dynamicStyle = {
    paddingLeft: column.id === "word" ? "12px" : undefined,
    color:
      column.id === "word" && row.original.difficultyLevel === "hard"
        ? "#ff1919"
        : undefined,
  };

  let wrapperClasses = styles.cellWrapper;
  if (blurAnimationState === "static")
    wrapperClasses += ` ${styles.isBlurredStatic}`;
  else if (blurAnimationState === "blurring")
    wrapperClasses += ` ${styles.isBlurring}`;
  else if (blurAnimationState === "unblurring")
    wrapperClasses += ` ${styles.isUnblurring}`;

  if (
    isRecallBlurActive &&
    (blurAnimationState === "blurring" || blurAnimationState === "static")
  ) {
    wrapperClasses += ` ${styles.canReveal}`;
  }

  const showOverlayElement =
    blurAnimationState === "blurring" ||
    blurAnimationState === "unblurring" ||
    blurAnimationState === "static";

  return (
    <div
      className={wrapperClasses}
      onClick={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      {showOverlayElement && (
        <div
          className={`${styles.blurOverlay} ${
            isCurrentlyGenerating ? styles.generatingEffect : ""
          }`}
        ></div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleOnChange}
        onKeyUp={adjustHeight}
        onBlur={handleOnBlur}
        className={`${styles.editableCell} ${
          isCurrentlyGenerating ? styles.pulsingText : ""
        }`}
        style={dynamicStyle}
        rows={1}
        maxLength={characterLimit > 0 ? characterLimit : undefined}
        onFocus={(e) => {
          if (showOverlayElement || isCurrentlyGenerating) {
            e.target.blur();
          }
        }}
        disabled={isCurrentlyGenerating}
      />
      {showLimitMessage && (
        <div className={styles.limitMessage}>
          Maximum {characterLimit} characters
        </div>
      )}
    </div>
  );
};

EditableCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
    original: PropTypes.shape({
      _id: PropTypes.string,
      difficultyLevel: PropTypes.string,
    }).isRequired,
  }).isRequired,
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  table: PropTypes.shape({
    options: PropTypes.shape({
      meta: PropTypes.shape({
        isOnRecallMood: PropTypes.bool,
        updateRowHeight: PropTypes.func,
        updateWords: PropTypes.func,
        rowHeights: PropTypes.array,
        generatingCells: PropTypes.arrayOf(
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          )
        ),
      }),
    }).isRequired,
  }).isRequired,
};

export default EditableCell;
