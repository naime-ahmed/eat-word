import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Popup.module.css";

const Popup = ({
  isOpen,
  onClose,
  position = "center",
  closeOnOutsideClick = true,
  showCloseButton = true,
  children,
  popupType = "dialog", // menu, dialog, form, notification
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

  // Calculate popup position
  const getPopupStyle = () => {
    if (position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    } else if (position === "top-left") {
      return {
        top: "0",
        left: "0",
      };
    } else if (position === "click" && clickPosition) {
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
        popupType === "dialog" || popupType === "form" ? styles.overlay : ""
      }`}
    >
      <div
        ref={popupRef}
        className={styles.popup}
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
