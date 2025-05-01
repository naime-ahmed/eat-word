import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import DigitAnimation from "../../../DigitAnimation/DigitAnimation";
import styles from "./PairChart.module.css";

const PairChart = ({
  chartType = "circle", // "circle" or "line"
  totalCount = 100,
  successCount = 65,
  size = 120,
  strokeWidth = 10,
  totalTooltip = "",
  successTooltip = "",
  isToolTipNotMobile = true,
  chartTitle = "",
}) => {
  const pct = Math.min(Math.max(successCount / totalCount, 0), 1);

  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 600 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

  // animation state for LINE MODE
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const tid = window.setTimeout(() => setLineWidth(pct * 100), 50);
    return () => clearTimeout(tid);
  }, [pct]);

  //  ── CIRCLE MODE
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  // animation state
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const tid = window.setTimeout(
      () => setOffset(circumference * (1 - pct)),
      50
    );
    return () => clearTimeout(tid);
  }, [circumference, pct]);

  if (chartType === "circle") {
    const linecap = pct === 1 ? "butt" : "round";

    return (
      <div className={styles.chartContainer}>
        <div className={styles.chart} onMouseMove={handleMouseMove}>
          <svg className={styles.svg} width={size} height={size}>
            <circle
              className={styles.background}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              onMouseEnter={() => setHovered("background")}
              onMouseLeave={() => setHovered(null)}
            />
            <circle
              className={styles.progress}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeLinecap={linecap}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
              onMouseEnter={() => setHovered("progress")}
              onMouseLeave={() => setHovered(null)}
            />
          </svg>

          <div
            className={styles.textGroup}
            style={{
              width: size - strokeWidth * 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className={styles.number}>
              <DigitAnimation value={successCount} /> / {totalCount}
            </span>
          </div>

          {/* desktop tooltip */}
          {!isMobile && hovered && totalTooltip && successTooltip && (
            <div
              className={styles.tooltip}
              style={{
                position: "fixed",
                top: mousePos.y + 18,
                left: mousePos.x - 32,
              }}
            >
              {hovered === "background" ? totalTooltip : successTooltip}
            </div>
          )}

          {/* mobile tooltips */}
          {isMobile && !isToolTipNotMobile && (
            <>
              <div className={`${styles.tooltip} ${styles.tooltipTop}`}>
                {totalTooltip}
              </div>
              <div className={`${styles.tooltip} ${styles.tooltipBottom}`}>
                {successTooltip}
              </div>
            </>
          )}
        </div>

        {chartTitle && <div className={styles.chartTitle}>{chartTitle}</div>}
      </div>
    );
  }

  //  ── LINE MODE
  const lineStyle = {
    height: strokeWidth,
    lineHeight: `${strokeWidth}px`,
  };

  const progStyle = {
    width: `${lineWidth}%`,
    height: strokeWidth,
    borderRadius: pct === 1 ? 0 : strokeWidth / 2,
    transition: "width 1s ease-out",
  };

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      <div
        className={styles.lineBackground}
        style={lineStyle}
        onMouseEnter={() => hovered !== "progress" && setHovered("background")}
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className={styles.lineProgress}
          style={progStyle}
          onMouseEnter={() => setHovered("progress")}
          onMouseLeave={() => setHovered("background")}
        />
      </div>

      {/* desktop tooltip */}
      {!isMobile && hovered && totalTooltip && successTooltip && (
        <div
          className={styles.tooltip}
          style={{
            position: "fixed",
            top: mousePos.y + 18,
            left: mousePos.x - 32,
          }}
        >
          {hovered === "background" ? totalTooltip : successTooltip}
        </div>
      )}

      {/* mobile tooltips */}
      {isMobile && !isToolTipNotMobile && (
        <>
          <div className={`${styles.tooltip} ${styles.tooltipTop}`}>
            {totalTooltip}
          </div>
          <div className={`${styles.tooltip} ${styles.tooltipBottom}`}>
            {successTooltip}
          </div>
        </>
      )}
    </div>
  );
};

PairChart.propTypes = {
  chartType: PropTypes.oneOf(["circle", "line"]),
  totalCount: PropTypes.number,
  successCount: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  totalTooltip: PropTypes.string,
  successTooltip: PropTypes.string,
  chartTitle: PropTypes.string,
  isToolTipNotMobile: PropTypes.bool,
};

export default PairChart;
