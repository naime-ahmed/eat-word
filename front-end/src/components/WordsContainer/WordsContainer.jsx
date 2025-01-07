import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBringMilestoneWordQuery } from "../../services/milestone";
import {
  useAppendWordMutation,
  useEditWordMutation,
} from "../../services/word";
import EditableCell from "./TableCells/EditableCell";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "./WordsContainer.module.css";
import { calculateColumnWidths, wordSchemaForClient } from "./utils";

const WordsContainer = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const [missingError, setMissingError] = useState("");
  const newWordsSet = useRef(new Set());
  const [rowHeights, setRowHeights] = useState({});

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
  const updateRowHeight = useCallback((rowIndex, { colId, value }) => {
    setRowHeights((prev) => {
      const currentRow = prev[rowIndex] || {};
      const updatedRow = { ...currentRow, [colId]: value };
      const maxHeight = Math.max(
        ...Object.entries(updatedRow)
          .filter(([key]) => key !== "curMax")
          .map(([, height]) => height)
      );
      updatedRow.curMax = maxHeight;
      return { ...prev, [rowIndex]: updatedRow };
    });
  }, []);

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

  // Table instance
  const table = useReactTable({
    columns,
    data: words,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateWords: (rowIndex, columnId, value) => {
        setWords((prev) => {
          const updatedWords = prev?.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          );

          const wordToUpdate = updatedWords[rowIndex];

          if (!wordToUpdate?._id) {
            if (wordToUpdate.word === "") {
              setMissingError("word field can not be empty");
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

  return (
    <div>
      <table className={styles.table}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <tbody>
          {table?.getRowModel()?.rows?.map((row) => (
            <TableRow key={row.id} row={row} rowHeights={rowHeights} />
          ))}
        </tbody>
      </table>
      <div className={styles.addNewWord}>
        <button onClick={handleAppendWord}>
          <i className="fa-solid fa-plus"></i> Add new word
        </button>
      </div>
      {missingError && <p style={{ color: "red" }}>{missingError}</p>}
    </div>
  );
};

export default WordsContainer;
