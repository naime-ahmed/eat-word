import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./EditableCell.module.css";

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  // Adjust textarea height based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
      console.log(`cell height: r -> ${row.index} `, textarea.scrollHeight);
      table.options.meta?.updateRowHeight(row.index, textarea.scrollHeight); // Notify parent about height
    }
  }, [row.index, table]);

  const handleOnChange = (e) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleOnKeyUp = () => {
    adjustHeight();
  };

  const handleOnBlur = useCallback(() => {
    table.options.meta?.updateWords(row.index, column.id, value);
    adjustHeight();
  }, [column.id, row.index, value, table.options.meta, adjustHeight]);

  useEffect(() => {
    setValue(initialValue);
    adjustHeight();
  }, [initialValue, adjustHeight]);

  // Synchronize textarea height with row height from parent
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${
        table.options.meta?.rowHeights[row.index] || textarea.scrollHeight
      }px`;
    }
  }, [row.index, table.options.meta?.rowHeights]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      height={table.options.meta?.rowHeights}
      onChange={handleOnChange}
      onKeyUp={handleOnKeyUp} // Call adjustHeight on keyup
      onBlur={handleOnBlur}
      className={styles.editableCell}
      rows={1}
    />
  );
};

export default EditableCell;

/*

rowHeights = {0:[{col_id: height}, {col_id: height}, {col_id: height}]}

*/
