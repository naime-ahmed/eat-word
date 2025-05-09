import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./ConfirmActionDialog.module.css";

const ConfirmActionDialog = ({
  title,
  description,
  confirmationText,
  onConfirm,
  confirmButtonText = "Confirm",
  errorMessage = "Input does not match the required text",
}) => {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (userInput.trim() === confirmationText) {
      setError("");
      onConfirm();
    } else {
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.confirmationDialog}>
      <h2 className={styles.heading}>{title}</h2>
      <p className={styles.instructionText}>
        {description}
        <strong>{` \u201C${confirmationText}\u201D`}</strong>
      </p>

      <input
        type="text"
        className={styles.confirmationInput}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
          setError("");
        }}
        placeholder={confirmationText}
        aria-label="Confirmation input"
      />

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      <button
        className={styles.confirmButton}
        onClick={handleSubmit}
        aria-label={confirmButtonText}
      >
        {confirmButtonText}
      </button>
    </div>
  );
};

ConfirmActionDialog.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  confirmationText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmButtonText: PropTypes.string,
  errorMessage: PropTypes.string,
};

export default ConfirmActionDialog;
