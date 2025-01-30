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
  const isOnRecallMode = table.options.meta?.isOnRecallMood;
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const characterLimit = CHARACTER_LIMITS[column.id] || 0;

  const showBlur =
    isOnRecallMode && column.id !== "word" && !isBlurDismissed && value;
  console.log("is on blur mood from cell", isOnRecallMode);

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

  // Add zoom detection
  useEffect(() => {
    const handleZoom = () => {
      requestAnimationFrame(adjustHeight);
    };

    // Listen for keyboard zoom
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-")) {
        handleZoom();
      }
    });

    // Listen for resize (catches both keyboard and mouse wheel zoom)
    window.visualViewport.addEventListener("resize", handleZoom);

    return () => {
      window.visualViewport.removeEventListener("resize", handleZoom);
    };
  }, [adjustHeight]);

  const handleOnChange = (e) => {
    const newValue = e.target.value.slice(0, characterLimit);
    setValue(newValue);

    if (e.target.value.length >= characterLimit) {
      setShowLimitMessage(true);
      setTimeout(() => setShowLimitMessage(false), 2000);
    }
    adjustHeight();
  };

  const handleOnKeyUp = () => {
    adjustHeight();
  };

  const handleOnBlur = useCallback(() => {
    if (initialValue !== value) {
      table.options.meta?.updateWords(row.index, column.id, value);
      adjustHeight();
    }
  }, [
    column.id,
    row.index,
    value,
    table.options.meta,
    adjustHeight,
    initialValue,
  ]);

  useEffect(() => {
    setValue(initialValue);
    adjustHeight();
  }, [initialValue, adjustHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${
        table.options.meta?.rowHeights[row.index]?.curMax ||
        textarea.scrollHeight
      }px`;
    }
  }, [row.index, table.options.meta?.rowHeights]);

  // Auto-focus the word cell if it's a new placeholder row
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

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (showBlur) {
      e.preventDefault();
      setIsBlurDismissed(true);
      return;
    }
    // Focus the textarea only if the blur layer is not active
    if (textareaRef.current && !showBlur) {
      textareaRef.current.focus();
    }
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
        height={table.options.meta?.rowHeights[row.index]?.curMax}
        onChange={handleOnChange}
        onKeyUp={handleOnKeyUp}
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

export default EditableCell;
