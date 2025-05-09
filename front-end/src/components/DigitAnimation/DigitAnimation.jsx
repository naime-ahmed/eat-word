import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const DigitAnimation = ({ value, duration = 500 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValue = useRef(displayValue);
  const startTime = useRef(null);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;

    const step = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      const progressRatio = Math.min(progress / duration, 1);
      const current = Math.floor(
        startValue.current + (value - startValue.current) * progressRatio
      );
      setDisplayValue(current);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration, displayValue]);

  return (
    <div style={{ display: "inline-block" }}>
      <span>{displayValue}</span>
    </div>
  );
};

DigitAnimation.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
};

export default DigitAnimation;
