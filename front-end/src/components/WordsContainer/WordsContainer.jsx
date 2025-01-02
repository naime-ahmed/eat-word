import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBringMilestoneWordQuery } from "../../services/milestone";
import { useEditWordMutation } from "../../services/word";
import EditableCell from "./TableCells/EditableCell";
import styles from "./WordsContainer.module.css";

const WordsContainer = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const [
    editWord,
    {
      isLoading: editWordIsLoading,
      isError: editWordIsError,
      error: editWordError,
    },
  ] = useEditWordMutation();
  /*
  rowHeights = {0:{colId:val},{colId:val}, {"curMax":maxHeight} }
  */
  const [rowHeights, setRowHeights] = useState({});

  // Fetch the data using the hook
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );

  // Effect to update words when data is available
  useEffect(() => {
    if (data?.words && !isError) {
      setWords(data.words);
    }
  }, [data, isError]);

  // Update row height for a specific row and column
  const updateRowHeight = useCallback((rowIndex, { colId, value }) => {
    setRowHeights((prev) => {
      const currentRow = prev[rowIndex] || {};

      const updatedRow = {
        ...currentRow,
        [colId]: value,
      };

      // Calculate the new maximum height for the row
      const maxHeight = Math.max(
        ...Object.entries(updatedRow)
          .filter(([key]) => key !== "curMax")
          .map(([, height]) => height)
      );
      updatedRow.curMax = maxHeight;

      return {
        ...prev,
        [rowIndex]: updatedRow,
      };
    });
    // console.log("row", rowHeights);
  }, []);

  // append new word
  const handleAppendWord = async () => {
    console.log("appending");
    // Create a new empty word object with default values
    const newWord = {
      word: "",
      meanings: "",
      synonyms: "",
      definitions: "",
      examples: "",
      memorized: false,
      difficultyLevel: "notSpecified",
      contextTags: "",
      frequency: 0,
      notes: "",
      addedBy: curMilestone?.addedBy,
      addedMilestone: curMilestone?._id,
      isFavorite: false,
      learnedScore: 0,
    };

    // Optimistically add the new word to the local state
    setWords((prev) => [...prev, newWord]);

    console.log("words after append new", words);
    // Optionally, you can focus on the new row's input field for better UX
    // This depends on how your EditableCell component is implemented
  };

  // update word
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
    if (editWordIsError) {
      console.log("edit word err", editWordError);
    }
  };

  // Column sizes in pixels
  let wordSize = 170;
  let meaningSize = 225;
  let synonymsSize = curMilestone?.learnSynonyms ? 225 : 0;
  let definitionsSize = curMilestone?.includeDefinition ? 280 : 0;
  if (synonymsSize === 0 && definitionsSize !== 0) {
    wordSize += Math.round(225 / 7);
    meaningSize += Math.round(225 / 5);
    definitionsSize += Math.round(225 / 4);
  } else if (synonymsSize !== 0 && definitionsSize === 0) {
    wordSize += Math.round(280 / 7);
    meaningSize += Math.round(280 / 5);
    synonymsSize += Math.round(280 / 5);
  } else if (synonymsSize === 0 && definitionsSize === 0) {
    wordSize += Math.round(505 / 7);
    meaningSize += Math.round(505 / 5);
  }
  const examplesSize =
    1250 - (wordSize + meaningSize + synonymsSize + definitionsSize);

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

  // Table instance
  const table = useReactTable({
    columns,
    data: words,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateWords: (rowIndex, columnId, value) => {
        setWords((prev) => {
          return prev.map((row, index) => {
            return index === rowIndex
              ? { ...prev[rowIndex], [columnId]: value }
              : row;
          });
        });

        console.log("params", curMilestone._id, { [columnId]: value });
        if (!words[rowIndex]._id) {
          return;
        }
        handleEditWord(words[rowIndex]?._id, { [columnId]: value });
      },
      updateRowHeight,
      rowHeights,
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.data.message}</div>;

  return (
    <div>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: `${header.column.columnDef.size}px` }}
                  className={styles.tableHeaderCell}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              style={{
                height: `${rowHeights[row.index]?.curMax || "auto"}px`,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    width: `${cell.column.columnDef.size}px`,
                  }}
                  className={styles.tableRowsCell}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* append new word */}
      <div className={styles.addNewWord}>
        <button onClick={handleAppendWord}>
          <i className="fa-solid fa-plus"></i> Add new word
        </button>
      </div>
    </div>
  );
};

export default WordsContainer;
