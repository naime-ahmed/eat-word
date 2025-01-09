import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBringMilestoneWordQuery } from "../../services/milestone";
import {
  useAppendWordMutation,
  useEditWordMutation,
} from "../../services/word";
import Notification from "../Notification/Notification";
import EditableCell from "./TableCells/EditableCell";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "./WordsContainer.module.css";
import { calculateColumnWidths, wordSchemaForClient } from "./utils";

const WordsContainer = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const [missingError, setMissingError] = useState("");
  const [doNotify, setDoNotify] = useState(false);
  const newWordsSet = useRef(new Set());
  const [rowHeights, setRowHeights] = useState([]);

  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );

  const [appendWord] = useAppendWordMutation();
  const [editWord] = useEditWordMutation();

  // Effect to update words when data is available
  useEffect(() => {
    if (data?.words && !isError) {
      setWords(data.words);
    }
  }, [data, isError]);

  // Update row height for a specific row and column
  const updateRowHeight = useCallback(
    (rowIndex, colId, value, action = "rerender") => {
      console.log("updating row height", rowIndex, colId, value, action);
      setRowHeights((prev) => {
        if (action === "delete") {
          if (rowIndex < 0 || rowIndex >= prev.length) {
            // Row index is out of bounds, do nothing
            return prev;
          }

          if (rowIndex === prev.length - 1) {
            // If the row is the last row, simply remove it
            return prev.slice(0, -1);
          } else {
            // If the row is in the middle, shift the row heights
            const newRowHeights = [...prev];
            for (let i = rowIndex; i < newRowHeights.length - 1; i++) {
              // Deep copy the next row's object into the current row
              newRowHeights[i] = { ...newRowHeights[i + 1] };
            }
            // Remove the last row
            newRowHeights.pop();
            return newRowHeights;
          }
        } else if (action === "append") {
          // Append a new row (used for failed delete action)
          return [...prev, value];
        } else if (action === "update") {
          // Update the row height for a specific column
          const updatedRowHeights = [...prev];
          const currentRow = updatedRowHeights[rowIndex] || {};
          const updatedRow = { ...currentRow, [colId]: value };

          // Calculate the new maximum height for the row
          const maxHeight = Math.max(
            ...Object.entries(updatedRow)
              .filter(([key]) => key !== "curMax")
              .map(([, height]) => height)
          );
          updatedRow.curMax = maxHeight;

          // Update the row in the array
          updatedRowHeights[rowIndex] = updatedRow;

          return updatedRowHeights;
        } else {
          // Default action: do nothing
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
  };

  // Update word
  const handleEditWord = async (wordId, editedFields) => {
    try {
      const res = await editWord({
        wordId,
        milestoneId: curMilestone?._id,
        updates: editedFields,
      }).unwrap();
      console.log(res);
    } catch (error) {
      console.log("Error while updating word", error);
    }
  };

  // Column sizes in pixels
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
  console.log("rowHeight", rowHeights);
  // Table instance
  const table = useReactTable({
    columns,
    data: words,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateWords: (rowIndex, columnId, value) => {
        console.log("on Update", rowIndex, columnId, value);
        if (!rowIndex || typeof rowIndex !== "number" || !columnId || !value) {
          return;
        }
        if (!words) {
          console.log("word is undefined!!");
          return;
        }
        setWords((prev) => {
          const updatedWords = prev?.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          );
          if (!updatedWords) {
            console.log("updated word is undefined!!");
            return;
          }
          console.log("updated words", updatedWords);
          const wordToUpdate = updatedWords[rowIndex];

          if (!wordToUpdate?._id) {
            if (wordToUpdate.word === "") {
              setMissingError("word is required! fill the word.");
              setDoNotify(true);
            } else {
              if (newWordsSet.current.has(rowIndex)) return;
              newWordsSet.current.add(rowIndex);

              appendWord(wordToUpdate)
                .unwrap()
                .then((response) => {
                  setWords((prevWords) =>
                    prevWords.map((word, index) =>
                      index === rowIndex ? response?.newWord : word
                    )
                  );
                })
                .catch((error) => {
                  console.error("Error while appending word:", error);
                  setDoNotify(true);
                  setMissingError("something went wrong while updating word");
                });
            }
          } else {
            handleEditWord(wordToUpdate?._id, { [columnId]: value });
          }

          return updatedWords;
        });
      },
      updateRowHeight,
      rowHeights,
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.data.message}</div>;
  // console.log("table after insert", table?.getRowModel()?.rows);
  return (
    <div>
      <table className={styles.table}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
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
      </table>
      <div className={styles.addNewWord}>
        <button onClick={handleAppendWord}>
          <i className="fa-solid fa-plus"></i> Add new word
        </button>
      </div>
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
