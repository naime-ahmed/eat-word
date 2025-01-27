// components/ConfirmationPopup.js
import { useCallback, useRef, useState } from "react";
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
      popupType="dialog"
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

// Custom hook to handle async confirmation
export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmColor: "#d33",
    cancelColor: "#3085d6",
  });
  const resolveRef = useRef(null);

  const confirm = useCallback((config) => {
    setIsOpen(true);
    setConfig({
      title: config.title || "Are you sure?",
      message: config.message || "",
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
      confirmColor: config.confirmColor || "#d33",
      cancelColor: config.cancelColor || "#3085d6",
    });
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.(false);
  }, []);

  return {
    confirm,
    confirmationProps: {
      isOpen,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
      ...config,
    },
  };
};

export default ConfirmationPopup;
