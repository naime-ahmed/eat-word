import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useBringMilestoneWordQuery } from "../../../services/milestone";
import { milestonePropTypes } from "../../../utils/propTypes.js";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn.jsx";
import Skeleton from "../../ui/loader/Skeleton/Skeleton.jsx";
import { useUpdateWords } from "../hooks/useUpdateWords.js";
import { calculateColumnWidths, wordSchemaForClient } from "../utils.js";
import Pagination from "./Pagination/Pagination.jsx";
import styles from "./Table.module.css";
import EditableCell from "./TableCells/EditableCell";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableSkeletonLoader from "./TableSkeletonLoader.jsx";

const WordsContainer = ({
  curMilestone,
  isOnRecallMood,
  setWordsLimit,
  setGenAILimit,
}) => {
  const [words, setWords] = useState([]);
  const [rowHeights, setRowHeights] = useState([]);
  const [generatingCells, setGeneratingCells] = useState([]); // [[rowIdx,colId],[rowIdx,colId]]
  const { updateWords, isAppendLoading } = useUpdateWords();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );

  useEffect(() => {
    setWords(data?.words || []);
    setWordsLimit((prev) => {
      if (!prev?.total) {
        return data?.wordRateLimit;
      }
      return prev;
    });
    setGenAILimit((prev) => {
      if (!prev?.total) {
        return data?.genAIRateLimit;
      }
      return prev;
    });
  }, [data, setGenAILimit, setWordsLimit]);

  // Reached milestone?
  const hasReached =
    curMilestone?.wordsCount ===
    Math.max(curMilestone?.targetWords, words?.length);

  // Update row height for a specific row and column
  const updateRowHeight = useCallback(
    (rowIndex, colId, value, action = "rerender") => {
      setRowHeights((prev) => {
        if (!Array.isArray(prev)) {
          console.error("Invalid `rowHeights` state:", prev);
          return [];
        }
        if (action === "delete") {
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
            for (let i = rowIndex; i < newRowHeights.length - 1; i++) {
              newRowHeights[i] = { ...newRowHeights[i + 1] };
            }
            newRowHeights.pop();
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

  const handleUpdate = (rowIndex, columnId, value) => {
    updateWords(
      setWords,
      setWordsLimit,
      rowIndex,
      columnId,
      value,
      curMilestone?._id
    );
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
        header: `${curMilestone.comfortableLang} meanings`,
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

  // Table instance with controlled pagination
  const table = useReactTable({
    columns,
    data: words,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    meta: {
      updateWords: handleUpdate,
      updateRowHeight,
      rowHeights,
      isOnRecallMood,
      generatingCells,
    },
  });

  // Append new word and navigate to the last page
  const handleAppendWord = async () => {
    const newWord = wordSchemaForClient(curMilestone);
    setWords((prev) => [...prev, newWord]);
    // Initialize row height for the new word
    setRowHeights((prev) => [...prev, {}]);

    setTimeout(() => {
      table.lastPage();
    }, 0);
  };

  // Refresh the page.
  const refreshPage = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <TableSkeletonLoader />;
  }

  if (isError)
    return (
      <div className={styles.errorOnWordLoad}>
        <span>
          {error?.data?.message || "Something went wrong while fetching words!"}
        </span>
        <PrimaryBtn
          btnType="button"
          handleClick={refreshPage}
          isLoading={isLoading}
          loadingText="loading..."
          colorOne="rgb(255 26 34)"
          colorTwo="rgb(143 9 13)"
        >
          Try again reloading
        </PrimaryBtn>
      </div>
    );

  return (
    <div>
      <table className={styles.table}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
        {words.length !== 0 && (
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                includeDefinition={curMilestone?.includeDefinition}
                learnSynonyms={curMilestone?.learnSynonyms}
                rowHeights={rowHeights}
                updateRowHeight={updateRowHeight}
                comfortableLang={curMilestone?.comfortableLang}
                learningLang={curMilestone?.learningLang}
                setGeneratingCells={setGeneratingCells}
                setGenAILimit={setGenAILimit}
              />
            ))}
          </tbody>
        )}
      </table>
      {hasReached ? (
        <></>
      ) : isAppendLoading ? (
        <div className={styles.loadingSpinner}>
          <Skeleton width="100%" height={26} label="saving word..." />
        </div>
      ) : words[words.length - 1]?._id || words.length === 0 ? (
        <div className={styles.addNewWord}>
          <button onClick={handleAppendWord}>
            <IoAddOutline />
            Add new word
          </button>
        </div>
      ) : null}
      {words.length >= 11 && (
        <div className={styles.pagination}>
          <Pagination table={table} />
        </div>
      )}
    </div>
  );
};

WordsContainer.propTypes = {
  curMilestone: milestonePropTypes,
  isOnRecallMood: PropTypes.bool,
  setWordsLimit: PropTypes.func.isRequired,
  setGenAILimit: PropTypes.func.isRequired,
};

export default WordsContainer;
