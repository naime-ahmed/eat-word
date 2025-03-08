import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const timeoutRef = useRef(null);

  // Derived values
  const characterLimit = CHARACTER_LIMITS[column.id] || 0;
  const isOnRecallMode = table.options.meta?.isOnRecallMood;
  const showBlur =
    isOnRecallMode && column.id !== "word" && !isBlurDismissed && value;

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

  // set the height to rows max height on mount
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${
        table.options.meta?.rowHeights[row.index]?.curMax ||
        textarea.scrollHeight
      }px`;
    }
  }, [row.index, table.options.meta?.rowHeights]);

  // Zoom/resize handler
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
      clearTimeout(timeoutRef.current);
    };
  }, [adjustHeight]);

  // Value synchronization
  useEffect(() => {
    setValue(initialValue);
    adjustHeight();
  }, [initialValue, adjustHeight]);

  // Initial focus for new rows
  useEffect(() => {
    if (
      column.id === "word" &&
      !row.original._id &&
      !hasFocusedRef.current &&
      textareaRef.current
    ) {
      textareaRef.current.focus();
      hasFocusedRef.current = true;
    }
  }, [column.id, row.original._id]);

  // Reset dismissal state when recall mode turns off
  useEffect(() => {
    if (!isOnRecallMode) {
      setIsBlurDismissed(false);
    }
  }, [isOnRecallMode]);

  const handleOnChange = (e) => {
    const newValue = e.target.value.slice(0, characterLimit);
    setValue(newValue);

    if (e.target.value.length >= characterLimit) {
      setShowLimitMessage(true);
      timeoutRef.current = setTimeout(() => setShowLimitMessage(false), 2000);
    }
    adjustHeight();
  };

  const handleOnBlur = useCallback(() => {
    if (initialValue !== value) {
      table.options.meta?.updateWords(row.index, column.id, value);
      adjustHeight();
    }
  }, [
    initialValue,
    value,
    row.index,
    column.id,
    table.options.meta,
    adjustHeight,
  ]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (showBlur) {
      e.preventDefault();
      setIsBlurDismissed(true);
      return;
    }
    textareaRef.current?.focus();
  };

  // dynamic style
  const style = {
    paddingLeft: column.id === "word" ? "12px" : undefined,
    color:
      column.id === "word" && row.original.difficultyLevel === "hard"
        ? "#ff1919"
        : undefined,
  };

  return (
    <div
      className={`${styles.cellWrapper} ${
        showBlur && value ? styles.blurred : ""
      }`}
      onClick={handleOverlayClick}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleOnChange}
        onKeyUp={adjustHeight}
        onBlur={handleOnBlur}
        className={styles.editableCell}
        style={style}
        rows={1}
        maxLength={characterLimit}
        onFocus={(e) => {
          if (showBlur) {
            e.target.blur();
          }
        }}
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
      }),
    }).isRequired,
  }).isRequired,
};

export default EditableCell;
