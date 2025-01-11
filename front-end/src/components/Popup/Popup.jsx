import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Popup.module.css";

const Popup = ({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  showCloseButton = true,
  children,
  popupType = "modal", // modal, menu, dialog
  clickPosition = null, // { x, y }
}) => {
  const popupRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        closeOnOutsideClick &&
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, closeOnOutsideClick, onClose]);

  // Calculate notification position
  const getPopupStyle = () => {
    if (popupType === "menu" && clickPosition) {
      return {
        top: `${clickPosition.y}px`,
        left: `${clickPosition.x + 15}px`,
      };
    }
    return {};
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`${
        popupType === "modal" || popupType === "dialog" ? styles.overlay : ""
      }`}
    >
      <div
        ref={popupRef}
        className={styles[popupType]}
        style={{
          ...getPopupStyle(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          {showCloseButton && (
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Popup;
