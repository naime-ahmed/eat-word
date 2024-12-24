import { useCallback, useEffect, useState } from "react";
import styles from "./EditableCell.module.css";

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const handleOnChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleOnBlur = useCallback(() => {
    table.options.meta?.updateWords(row.index, column.id, value);
  }, [column.id, row.index, value, table.options.meta]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <textarea
      value={value}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      className={styles.editableCell}
      style={{ resize: "none", width: "100%" }} // Prevent resizing and set width
    />
  );
};

export default EditableCell;
