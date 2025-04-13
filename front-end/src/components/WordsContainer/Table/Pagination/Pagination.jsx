import PropTypes from "prop-types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import styles from "./Pagination.module.css";

const Pagination = ({ table }) => {
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  // Build an array of pages to display.
  const getPageNumbers = () => {
    const pages = [];
    if (pageCount <= 7) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      const delta = 1;
      let range = [];
      for (
        let i = Math.max(2, pageIndex - delta);
        i <= Math.min(pageCount - 1, pageIndex + delta);
        i++
      ) {
        range.push(i);
      }
      if (pageIndex - delta > 2) {
        range.unshift("...");
      }
      if (pageIndex + delta < pageCount - 1) {
        range.push("...");
      }
      pages.push(0, 1, ...range, pageCount - 1);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      <div
        className={`${styles.paginationNumber} ${styles.arrow}`}
        onClick={() => table.firstPage()}
        style={{
          pointerEvents: table.getCanPreviousPage() ? "auto" : "none",
          opacity: table.getCanPreviousPage() ? 1 : 0.5,
        }}
      >
        <RiArrowLeftDoubleLine size={18} />
      </div>
      <div
        className={`${styles.paginationNumber} ${styles.arrow}`}
        onClick={() => table.previousPage()}
        style={{
          pointerEvents: table.getCanPreviousPage() ? "auto" : "none",
          opacity: table.getCanPreviousPage() ? 1 : 0.5,
        }}
      >
        <IoIosArrowBack size={18} />
        <span className={styles.arrowText}>Previous</span>
      </div>

      {pages.map((page, idx) => {
        if (page === "...") {
          return (
            <div
              key={`ellipsis-${idx}`}
              className={styles.paginationNumber}
              style={{ cursor: "default" }}
            >
              ...
            </div>
          );
        } else {
          return (
            <div
              key={page}
              className={`${styles.paginationNumber} ${
                pageIndex === page ? styles.paginationActive : ""
              }`}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </div>
          );
        }
      })}

      <div
        className={`${styles.paginationNumber} ${styles.arrow}`}
        onClick={() => table.nextPage()}
        style={{
          pointerEvents: table.getCanNextPage() ? "auto" : "none",
          opacity: table.getCanNextPage() ? 1 : 0.5,
        }}
      >
        <IoIosArrowForward size={18} />
      </div>
      <div
        className={`${styles.paginationNumber} ${styles.arrow}`}
        onClick={() => table.lastPage()}
        style={{
          pointerEvents: table.getCanNextPage() ? "auto" : "none",
          opacity: table.getCanNextPage() ? 1 : 0.5,
        }}
      >
        <RiArrowRightDoubleLine size={18} />
      </div>
    </div>
  );
};

Pagination.propTypes = {
  table: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    getPageCount: PropTypes.func.isRequired,
    getCanPreviousPage: PropTypes.func.isRequired,
    getCanNextPage: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    setPageIndex: PropTypes.func.isRequired,
    firstPage: PropTypes.func.isRequired,
    lastPage: PropTypes.func.isRequired,
  }).isRequired,
};

export default Pagination;
