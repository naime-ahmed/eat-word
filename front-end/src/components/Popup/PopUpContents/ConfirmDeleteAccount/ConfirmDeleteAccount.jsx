import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./ConfirmDeleteAccount.module.css";

const ConfirmDeleteAccount = ({ handleDeleteAccount }) => {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const CONFIRMATION_TEXT = "delete my account";

  const handleSubmit = () => {
    if (userInput.trim() === CONFIRMATION_TEXT) {
      setError("");
      handleDeleteAccount();
    } else {
      setError("Input does not match the required text");
    }
  };

  return (
    <div className={styles.confirmationDialog}>
      <h2 className={styles.heading}>Confirm Account Deletion</h2>
      <p className={styles.instructionText}>
        To confirm deletion, please type <strong>{CONFIRMATION_TEXT}</strong>{" "}
        below:
      </p>

      <input
        type="text"
        className={styles.confirmationInput}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
          setError("");
        }}
        placeholder={CONFIRMATION_TEXT}
        aria-label="Account deletion confirmation input"
      />

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      <button
        className={styles.deleteButton}
        onClick={handleSubmit}
        aria-label="Permanently delete account"
      >
        Delete Account Permanently
      </button>
    </div>
  );
};

ConfirmDeleteAccount.propTypes = {
  handleDeleteAccount: PropTypes.func,
};

export default ConfirmDeleteAccount;
