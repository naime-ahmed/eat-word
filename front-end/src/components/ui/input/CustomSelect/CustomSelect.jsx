import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({
  value,
  onChange,
  options, //[{id, text}]
  placeholder = "Choose match...",
  customStyles = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);

  // Find the selected option's text
  const selectedOption = options.find((opt) => opt.text === selectedValue);
  const displayText = selectedOption ? selectedOption.text : placeholder;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionText) => {
    setSelectedValue(optionText);
    onChange(optionText);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.customSelectContainer} ref={selectRef}>
      <button
        type="button"
        className={`${styles.selectToggle} ${isOpen ? styles.open : ""}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        style={customStyles}
      >
        <span className={styles.selectText}>{displayText}</span>
        <span className={styles.selectArrow}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </span>
      </button>

      {/* Custom dropdown */}
      {isOpen && (
        <div className={styles.selectDropdown} style={customStyles}>
          <div className={styles.dropdownContent}>
            {options.map((option) => (
              <div
                key={option.id}
                className={`${styles.option} ${
                  selectedValue === option.text ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick(option.text)}
              >
                <div className={styles.optionContent}>
                  <span>{option.text}</span>
                  {selectedValue === option.text && (
                    <svg
                      className={styles.checkIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  customStyles: PropTypes.object,
};

export default CustomSelect;
