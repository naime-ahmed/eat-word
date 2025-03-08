import Popup from "../Popup";
import styles from "./ConfirmationPopup.module.css";

const ConfirmationPopup = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "#d33",
  cancelColor = "#3085d6",
}) => {
  return (
    <Popup
      isOpen={isOpen}
      onClose={onCancel}
      closeOnOutsideClick={false}
      showCloseButton={true}
      popupType="modal"
    >
      <div className={styles.confirmationContent}>
        <h3 className={styles.confirmationTitle}>{title}</h3>
        <p className={styles.confirmationMessage}>{message}</p>
        <div className={styles.confirmationButtons}>
          <button
            className={styles.confirmationButton}
            style={{ backgroundColor: cancelColor }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={styles.confirmationButton}
            style={{ backgroundColor: confirmColor }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ConfirmationPopup;
