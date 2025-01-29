import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBringMilestoneWordQuery } from "../../../services/milestone";
import Notification from "../../Notification/Notification";
import { useUpdateWords } from "../hooks/useUpdateWords.js";
import { calculateColumnWidths, wordSchemaForClient } from "../utils.js";
import styles from "./Table.module.css";
import EditableCell from "./TableCells/EditableCell";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableSkeletonLoader from "./TableSkeletonLoader.jsx";

const WordsContainer = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const [rowHeights, setRowHeights] = useState([]);
  const { updateWords, missingError, doNotify, setDoNotify } = useUpdateWords();

  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );

  // Effect to update words when data is available
  useEffect(() => {
    setWords(data?.words || []);
  }, [data]);

  // Update row height for a specific row and column
  const updateRowHeight = useCallback(
    (rowIndex, colId, value, action = "rerender") => {
      setRowHeights((prev) => {
        if (!Array.isArray(prev)) {
          console.error("Invalid `rowHeights` state:", prev);
          return [];
        }
        if (action === "delete") {
          console.log("updating row height", rowIndex, colId, value, action);
          if (
            rowIndex === undefined ||
            rowIndex < 0 ||
            rowIndex >= prev.length
          ) {
            console.error("Invalid rowIndex for deletion:", rowIndex);
            return prev;
          }

          const newRowHeights = [...prev];

          if (rowIndex === 0) {
            // Special case for deleting the first row
            if (newRowHeights.length > 1) {
              for (let i = 0; i < newRowHeights.length - 1; i++) {
                newRowHeights[i] = { ...newRowHeights[i + 1] };
              }
            }
            newRowHeights.pop();
            return newRowHeights;
          } else if (rowIndex === prev.length - 1) {
            return prev.slice(0, -1);
          } else {
            // console.log("row height before: ", rowHeights);
            for (let i = rowIndex; i < newRowHeights.length - 1; i++) {
              newRowHeights[i] = { ...newRowHeights[i + 1] };
            }
            newRowHeights.pop();
            // console.log("row height after: ", rowHeights);
            return newRowHeights;
          }
        } else if (action === "append") {
          return [...prev, value];
        } else if (action === "update") {
          const updatedRowHeights = [...prev];
          const currentRow = updatedRowHeights[rowIndex] || {};
          const updatedRow = { ...currentRow, [colId]: value };

          const maxHeight = Math.max(
            ...Object.entries(updatedRow)
              .filter(([key]) => key !== "curMax")
              .map(([, height]) => height)
          );
          updatedRow.curMax = maxHeight;

          updatedRowHeights[rowIndex] = updatedRow;
          return updatedRowHeights;
        } else {
          return prev;
        }
      });
    },
    []
  );

  // Append new word
  const handleAppendWord = async () => {
    const newWord = wordSchemaForClient(curMilestone);
    setWords((prev) => [...prev, newWord]);

    // Initialize row height for the new word
    setRowHeights((prev) => [...prev, {}]);
  };

  const handleUpdate = (rowIndex, columnId, value) => {
    updateWords(setWords, rowIndex, columnId, value, curMilestone?._id);
  };

  const { wordSize, meaningSize, synonymsSize, definitionsSize, examplesSize } =
    calculateColumnWidths(curMilestone);

  // Define columns dynamically
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "word",
        header: "Word",
        size: wordSize,
        cell: EditableCell,
      },
      {
        accessorKey: "meanings",
        header: "Meanings",
        size: meaningSize,
        cell: EditableCell,
      },
      {
        accessorKey: "examples",
        header: "Examples",
        size: examplesSize,
        cell: EditableCell,
      },
    ];

    if (curMilestone?.learnSynonyms) {
      baseColumns.splice(2, 0, {
        accessorKey: "synonyms",
        header: "Synonyms",
        size: synonymsSize,
        cell: EditableCell,
      });
    }

    if (curMilestone?.includeDefinition) {
      baseColumns.splice(curMilestone?.learnSynonyms ? 3 : 2, 0, {
        accessorKey: "definitions",
        header: "Definitions",
        size: definitionsSize,
        cell: EditableCell,
      });
    }

    return baseColumns;
  }, [
    curMilestone,
    wordSize,
    definitionsSize,
    synonymsSize,
    examplesSize,
    meaningSize,
  ]);
  console.log("words", words);
  console.log("row height after: ", rowHeights);
  // console.log("rowHeight", rowHeights);
  // Table instance
  const table = useReactTable({
    columns,
    data: words,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateWords: handleUpdate,
      updateRowHeight,
      rowHeights,
    },
  });

  if (isLoading) {
    return <TableSkeletonLoader />;
  }

  if (isError) {
    console.log(error);
  }
  // if (isError) return <div>Error: {error.data.message}</div>;
  console.log("table after insert", table?.getRowModel()?.rows);
  return (
    <div>
      <table className={styles.table}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
        {words.length !== 0 && (
          <tbody>
            {table?.getRowModel()?.rows?.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                rowHeights={rowHeights}
                updateRowHeight={updateRowHeight}
              />
            ))}
          </tbody>
        )}
      </table>
      {words[words.length - 1]?._id || words.length === 0 ? (
        <div className={styles.addNewWord}>
          <button onClick={handleAppendWord}>
            <i className="fa-solid fa-plus"></i> Add new word
          </button>
        </div>
      ) : (
        <></>
      )}
      {missingError && (
        <Notification
          title="An Error Occurred!"
          message={missingError}
          isOpen={doNotify}
          onClose={() => setDoNotify(false)}
        />
      )}
    </div>
  );
};

export default WordsContainer;
