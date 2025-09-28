import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./QuestionTimer.module.css";

const UPDATE_INTERVAL_MS = 50; // Updates at 20fps for smooth animation

function QuestionTimer({
  timeBoundInSec,
  onTimeUp,
  variant = "circular",
  width = 60,
  strokeWidth = 4,
}) {
  const [timeLeftMs, setTimeLeftMs] = useState(timeBoundInSec * 1000);
  const intervalRef = useRef(null);
  const hasFiredRef = useRef(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    clearInterval(intervalRef.current);
    hasFiredRef.current = false;

    // mark the new start time
    startTimeRef.current = Date.now();
    setTimeLeftMs(timeBoundInSec * 1000);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = timeBoundInSec * 1000 - elapsed;

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        if (!hasFiredRef.current) {
          hasFiredRef.current = true;
          setTimeLeftMs(0);
          onTimeUp?.();
        }
      } else {
        setTimeLeftMs(remaining);
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeBoundInSec]); // exclude onTimeUp from dependency array

  // Memoize derived style values to avoid recalculating on every render
  const { radius, circumference, fontSize } = useMemo(() => {
    const safeStrokeWidth = Math.max(1, Math.min(strokeWidth, width / 2 - 1));
    const r = (width - safeStrokeWidth) / 2;
    const c = 2 * Math.PI * r;

    const fs = Math.max(10, Math.min(width / 4, 28));
    return { radius: r, circumference: c, fontSize: fs };
  }, [width, strokeWidth]);

  const getUrgencyLevel = () => {
    const percentage = (timeLeftMs / (timeBoundInSec * 1000)) * 100;
    if (percentage <= 25) return "high";
    if (percentage <= 50) return "medium";
    return "low";
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    if (totalSeconds >= 60) {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return totalSeconds.toString();
  };

  // --- Render Circular SVG Variant ---
  if (variant === "circular") {
    const progress = timeLeftMs / (timeBoundInSec * 1000);
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div
        className={styles.circularTimer}
        style={{ width, height: width }}
        data-urgency={getUrgencyLevel()}
        aria-label={`Time remaining: ${formatTime(timeLeftMs)}`}
      >
        <svg
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
          className={styles.timerSvg}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={styles.timerTrack}
          />
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={styles.timerProgress}
          />
        </svg>
        <span
          className={styles.timerText}
          style={{ fontSize: `${fontSize}px` }}
        >
          {formatTime(timeLeftMs)}
        </span>
      </div>
    );
  }

  // --- Render Linear Variant ---
  const progressPercentage = (timeLeftMs / (timeBoundInSec * 1000)) * 100;
  return (
    <div
      className={styles.linearTimer}
      style={{
        minWidth: width,
        height: Math.max(20, width / 6),
        borderRadius: width / 4,
      }}
      data-urgency={getUrgencyLevel()}
      aria-label={`Time remaining: ${formatTime(timeLeftMs)}`}
    >
      <div
        className={styles.linearProgress}
        style={{ width: `${progressPercentage}%`, borderRadius: width / 4 }}
      ></div>
      <span
        className={styles.timerTextLinear}
        style={{ fontSize: `${Math.max(10, fontSize * 0.65)}px` }}
      >
        {formatTime(timeLeftMs)}
      </span>
    </div>
  );
}

QuestionTimer.propTypes = {
  timeBoundInSec: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func,
  variant: PropTypes.oneOf(["circular", "linear"]),
  width: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default QuestionTimer;
