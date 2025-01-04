import { flexRender } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import Popup from "../Popup/Popup";
import TableRowMenu from "../Popup/PopUpContents/TableRowMenu/TableRowMenu";
import styles from "./WordsContainer.module.css";

const TableRow = ({ row, rowHeights }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

  const handleButtonClick = (e) => {
    // Calculate click position with scroll offset
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    setClickPosition({ x, y });
    setIsPopupOpen(true);
  };

  const handleOneClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  return (
    <tr
      key={row.id}
      style={{
        height: `${rowHeights[row.index]?.curMax || "auto"}px`,
      }}
      className={styles.row}
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
      <span className={styles.rowAction} onClick={handleButtonClick}>
        <RxDragHandleDots2 />
        <Popup
          isOpen={isPopupOpen}
          onClose={handleOneClose}
          position="click"
          showCloseButton={false}
          clickPosition={clickPosition}
          popupType="menu"
        >
          <TableRowMenu />
        </Popup>
      </span>
    </tr>
  );
};

export default TableRow;
