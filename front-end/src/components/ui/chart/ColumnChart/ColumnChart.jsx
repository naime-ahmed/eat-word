import PropTypes from "prop-types";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./ColumnChart.module.css";

const ColumnChart = ({
  total_credit = 30,
  consumed = 12,
  width = 150,
  height = 100,
  column_count = 3,
  column_gap = "12px",
}) => {
  const columnData = useMemo(() => {
    const total = Math.max(1, total_credit);
    const consumedAmount = Math.max(0, Math.min(consumed, total));
    const count = Math.max(1, column_count);
    const creditPerColumn = total / count;

    let remainingConsumed = consumedAmount;
    const columns = [];

    for (let i = 0; i < count; i++) {
      const consumedFromThisColumn = Math.min(
        remainingConsumed,
        creditPerColumn
      );
      const remainingInThisColumn = creditPerColumn - consumedFromThisColumn;

      columns.push({
        credit: remainingInThisColumn,
        ratio:
          creditPerColumn > 0 ? remainingInThisColumn / creditPerColumn : 0,
      });

      remainingConsumed -= consumedFromThisColumn;
    }

    return columns;
  }, [total_credit, consumed, column_count]);

  const [columnHeights, setColumnHeights] = useState(
    Array(Math.max(1, column_count)).fill(0)
  );

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setColumnHeights(columnData.map((d) => d.ratio * 100));
    }, 100);

    return () => clearTimeout(animationTimeout);
  }, [columnData]);

  const [dynamicFontSize, setDynamicFontSize] = useState(12);
  const columnRef = useRef(null);

  useLayoutEffect(() => {
    if (columnRef.current) {
      const columnWidth = columnRef.current.offsetWidth;
      const desiredFontSize = Math.min(columnWidth * 0.3, 12);
      const clampedFontSize = Math.max(10, desiredFontSize);
      setDynamicFontSize(clampedFontSize);
    }
  }, [width, column_count]);

  return (
    <>
      <div
        className={styles.creditChartContainer}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        aria-label={`Credit chart showing ${
          total_credit - consumed
        } of ${total_credit} remaining`}
      >
        <div className={styles.chartBody} style={{ gap: column_gap }}>
          {columnHeights.map((heightPercentage, index) => (
            <div
              key={index}
              className={styles.column}
              ref={index === 0 ? columnRef : null}
            >
              <div
                className={styles.columnFill}
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <span
                className={styles.percentageText}
                style={{ fontSize: `${dynamicFontSize}px` }}
              >
                {`${Math.round(columnData[index].ratio * 100)}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

ColumnChart.propTypes = {
  total_credit: PropTypes.number.isRequired,
  consumed: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  column_count: PropTypes.number,
  column_gap: PropTypes.string,
};

export default ColumnChart;
