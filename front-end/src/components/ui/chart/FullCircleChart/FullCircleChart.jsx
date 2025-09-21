import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import DigitAnimation from "../../../DigitAnimation/DigitAnimation";
import Tooltip from "../../Tooltip/Tooltip";
import styles from "./FullCircleChart.module.css";

const CircularProgressChart = ({
  totalCount = 100,
  successCount = 65,
  size = 120,
  strokeWidth = 12,
  achieved_tooltip = "Achieved",
  remains_tooltip = "Remaining",
}) => {
  // Calculate the percentage, ensuring it's between 0 and 1
  const pct = useMemo(
    () => Math.min(Math.max(successCount / totalCount, 0), 1),
    [successCount, totalCount]
  );
  const percentage = Math.round(pct * 100);

  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const showTooltip = (content) => (e) => {
    setTooltip({ visible: true, content, x: e.clientX, y: e.clientY });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // SVG and Circle calculations
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(
    () => circumference * (1 - pct),
    [circumference, pct]
  );

  const backgroundStrokeWidth = strokeWidth / 2;

  // Animation for the progress circle offset
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const animationTimeout = setTimeout(() => setOffset(strokeDashoffset), 50);
    return () => clearTimeout(animationTimeout);
  }, [strokeDashoffset]);

  return (
    <div className={styles.chartContainer} onMouseMove={handleMouseMove}>
      <div
        className={styles.chartWrapper}
        style={{
          width: size,
          height: size,
        }}
      >
        <svg className={styles.svg} width={size} height={size}>
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" className={styles.gradientStart} />
              <stop offset="100%" className={styles.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background Circle */}
          <circle
            className={styles.background}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={backgroundStrokeWidth}
            onMouseEnter={showTooltip(remains_tooltip)}
            onMouseLeave={hideTooltip}
          />

          {/* Progress Circle */}
          <circle
            className={styles.progress}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap={pct === 1 ? "butt" : "round"}
            stroke="url(#progressGradient)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
            onMouseEnter={showTooltip(achieved_tooltip)}
            onMouseLeave={hideTooltip}
          />
        </svg>

        <div className={styles.textGroup}>
          <span
            className={styles.percentage}
            style={{ fontSize: `${0.6 + (size / 100) * 0.5}rem` }}
          >
            <DigitAnimation value={percentage} />%
          </span>
        </div>
      </div>

      <Tooltip
        visible={tooltip.visible}
        content={tooltip.content}
        x={tooltip.x}
        y={tooltip.y}
      />
    </div>
  );
};

CircularProgressChart.propTypes = {
  totalCount: PropTypes.number,
  successCount: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  achieved_tooltip: PropTypes.string,
  remains_tooltip: PropTypes.string,
  chartTitle: PropTypes.string,
};

export default CircularProgressChart;
