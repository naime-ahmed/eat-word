import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import styles from "./SliderInput.module.css";

export default function SliderInput({ min = 10, max = 25, value, onChange }) {
  const [internalValue, setInternalValue] = useState(value || min);
  const sliderRef = useRef(null);

  useEffect(() => {
    setInternalValue(value || min);
  }, [value, min]);

  const handlePointerMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const newValue = Math.round((x / rect.width) * (max - min) + min);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  const handleTrackClick = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const newValue = Math.round((x / rect.width) * (max - min) + min);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((internalValue - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderWrapper}>
      <div
        className={styles.sliderTrack}
        ref={sliderRef}
        onClick={handleTrackClick}
      >
        <div
          className={styles.sliderProgress}
          style={{ width: `${percentage}%` }}
        />
        <div
          className={styles.sliderThumb}
          style={{ left: `${percentage}%` }}
          onPointerDown={handlePointerDown}
        >
          <div className={styles.valueBubble}>{internalValue}</div>
        </div>
      </div>
    </div>
  );
}

SliderInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
};
