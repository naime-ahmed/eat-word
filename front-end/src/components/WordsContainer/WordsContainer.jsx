import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useBringMilestoneWordQuery } from "../../services/milestone";
import EditableCell from "./TableCells/EditableCell";
import styles from "./WordsContainer.module.css";

const WordsContainer = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );

  useEffect(() => {
    if (data?.words) {
      setWords(data.words);
    }
  }, [data]);

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
      },
    },
  });
  console.log(words);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

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
            <tr key={row.id}>
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
    </div>
  );
};

export default WordsContainer;
