import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { IoIosCloseCircle } from "react-icons/io";
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
      e.stopPropagation();

      // Check if the click is inside any popup (parent or nested)
      const isInsidePopup = e.target.closest('[data-popup="true"]');

      if (
        closeOnOutsideClick &&
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !isInsidePopup // Do not close if the click is inside a nested popup
      ) {
        console.log("click outside modal");
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
        data-popup="true" // Add this attribute to identify the popup
      >
        <div className={styles.content}>
          {showCloseButton && (
            <button className={styles.closeButton} onClick={onClose}>
              <IoIosCloseCircle />
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
