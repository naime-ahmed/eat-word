import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import Tooltip from "../../Tooltip/Tooltip";
import styles from "./HalfCircleChart.module.css";

const HalfCircleChart = ({
  achieved_count,
  remains_count,
  achieved_color_one = "#0064D6",
  achieved_color_two = "#B0D6FF",
  remains_color_one = "#1A2330",
  remains_color_two = "#7DA8D4",
  thickness = 20,
  maxWidth = 200,
  achieved_tooltip = "Achieved",
  remains_tooltip = "Remaining",
}) => {
  const [animateAchieved, setAnimateAchieved] = useState(false);
  const [animateRemains, setAnimateRemains] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const total = achieved_count + remains_count;
  const percentage = total > 0 ? (achieved_count / total) * 100 : 0;

  const hasAchieved = achieved_count > 0;
  const hasRemains = remains_count > 0;

  // Gap is 2% of the full semicircle
  const gapPercent = hasAchieved && hasRemains ? 2 : 0;

  const viewBoxSize = 200;
  const radius = viewBoxSize / 2 - thickness / 2;
  const pathLength = 100;

  // Adjust arc lengths to account for the gap
  const achievedPathValue = hasAchieved
    ? Math.max(0, percentage - gapPercent / 2)
    : 0;
  const remainsPathValue = hasRemains
    ? Math.max(0, 100 - percentage - gapPercent / 2)
    : 0;
  const remainsPathOffset = -(percentage + gapPercent / 2);

  useEffect(() => {
    const animationDuration = 800;

    // Start achieved arc animation
    const achieveTimer = setTimeout(() => setAnimateAchieved(true), 100);

    // Start remains arc animation only AFTER achieved arc is complete
    const remainsTimer = setTimeout(
      () => setAnimateRemains(true),
      100 + animationDuration + 50 // Small delay after achieved completes
    );

    // Animate the percentage text counting up
    let start = 0;
    const end = Math.round(percentage);
    if (start === end) {
      setDisplayPercent(end);
      return;
    }

    const incrementTime = animationDuration / end;
    const counterId = setInterval(() => {
      start += 1;
      setDisplayPercent(start);
      if (start >= end) clearInterval(counterId);
    }, incrementTime);

    return () => {
      clearTimeout(achieveTimer);
      clearTimeout(remainsTimer);
      clearInterval(counterId);
    };
  }, [percentage]);

  const handleMouseMove = (e) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const showTooltip = (content) => (e) => {
    setTooltip({ visible: true, content, x: e.clientX, y: e.clientY });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Styles for the visible, animated arcs
  const achievedStyle = {
    strokeDasharray: animateAchieved
      ? `${achievedPathValue} ${pathLength}`
      : `0 ${pathLength}`,
  };
  const remainsStyle = {
    strokeDasharray: animateRemains
      ? `${remainsPathValue} ${pathLength}`
      : `0 ${pathLength}`,
    strokeDashoffset: remainsPathOffset,
  };

  // Styles for the invisible hover targets (no animation)
  const hoverAchievedStyle = {
    strokeDasharray: `${achievedPathValue} ${pathLength}`,
  };
  const hoverRemainsStyle = {
    strokeDasharray: `${remainsPathValue} ${pathLength}`,
    strokeDashoffset: remainsPathOffset,
  };

  // Memoize path `d` attribute since it doesn't change
  const arcPathD = useMemo(() => {
    const startX = viewBoxSize / 2 - radius;
    const y = viewBoxSize / 2;
    const endX = viewBoxSize / 2 + radius;
    return `M ${startX},${y} A ${radius},${radius} 0 0 1 ${endX},${y}`;
  }, [radius]);

  return (
    <div
      className={styles.chartContainer}
      onMouseMove={handleMouseMove}
      style={{ maxWidth: maxWidth }}
    >
      <svg
        className={styles.chartSvg}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize / 2}`}
      >
        <defs>
          <linearGradient
            id="chart-gradient-achieved"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={achieved_color_one} />
            <stop offset="100%" stopColor={achieved_color_two} />
          </linearGradient>
          <linearGradient
            id="chart-gradient-remains"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={remains_color_two} />
            <stop offset="100%" stopColor={remains_color_one} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          className={styles.chartArcBackground}
          d={arcPathD}
          strokeWidth={thickness}
          pathLength={pathLength}
        />

        {/* Remains Arc */}
        {hasRemains && (
          <path
            className={`${styles.chartArc} ${styles.chartArcRemains}`}
            d={arcPathD}
            strokeWidth={thickness}
            pathLength={pathLength}
            style={remainsStyle}
          />
        )}

        {/* Achieved Arc */}
        {hasAchieved && (
          <path
            className={`${styles.chartArc} ${styles.chartArcAchieved}`}
            d={arcPathD}
            strokeWidth={thickness}
            pathLength={pathLength}
            style={achievedStyle}
          />
        )}

        {/* Hover Targets (Invisible) */}
        {hasAchieved && (
          <path
            className={styles.chartArcHoverTarget}
            d={arcPathD}
            strokeWidth={thickness + 10}
            pathLength={pathLength}
            style={hoverAchievedStyle}
            onMouseEnter={showTooltip(achieved_tooltip)}
            onMouseLeave={hideTooltip}
          />
        )}
        {hasRemains && (
          <path
            className={styles.chartArcHoverTarget}
            d={arcPathD}
            strokeWidth={thickness + 10}
            pathLength={pathLength}
            style={hoverRemainsStyle}
            onMouseEnter={showTooltip(remains_tooltip)}
            onMouseLeave={hideTooltip}
          />
        )}
      </svg>

      <div className={styles.centerText}>
        <div
          className={styles.centerTextPercentage}
          style={{ fontSize: `${0.4 + (maxWidth / 100) * 0.5}rem` }}
        >
          {displayPercent}%
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

HalfCircleChart.propTypes = {
  achieved_count: PropTypes.number.isRequired,
  remains_count: PropTypes.number.isRequired,
  achieved_color_one: PropTypes.string,
  achieved_color_two: PropTypes.string,
  remains_color_one: PropTypes.string,
  remains_color_two: PropTypes.string,
  thickness: PropTypes.number,
  achieved_tooltip: PropTypes.string,
  remains_tooltip: PropTypes.string,
  maxWidth: PropTypes.number,
};

export default HalfCircleChart;
