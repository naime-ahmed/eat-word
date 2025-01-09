import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./EditableCell.module.css";

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    console.log("calling from editable callId", column?.id);
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
    setValue(e.target.value);
    adjustHeight();
  };

  const handleOnKeyUp = () => {
    adjustHeight();
  };

  const handleOnBlur = useCallback(() => {
    console.log("called on blur");
    if (initialValue !== value) {
      console.log("called on blur inside");
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

  // dynamic style
  const style = {
    paddingLeft: column.id === "word" ? "12px" : undefined,
    color:
      column.id === "word" && row.original.difficultyLevel === "hard"
        ? "#ff1919"
        : undefined,
  };

  return (
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
    />
  );
};

export default EditableCell;
