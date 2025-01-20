import { useEffect, useRef, useState } from "react";
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
  const contentRef = useRef(null);
  const [popupDimensions, setPopupDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Measure the dimensions of the content after it renders
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setPopupDimensions({ width, height });
    }
  }, [isOpen, children]);

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
        !isInsidePopup
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

  // Remove scroll
  useEffect(() => {
    if (isOpen && popupType !== "menu") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, popupType]);

  // Calculate popup position
  const getPopupStyle = () => {
    if (popupType === "menu" && clickPosition) {
      const { width: popupWidth, height: popupHeight } = popupDimensions;

      let left = clickPosition.x + 15;
      let top = clickPosition.y + 15;

      if (window.innerWidth <= 600) {
        left = clickPosition.x - popupWidth - 15;
      }

      // Adjust if the popup would overflow the right edge
      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - (popupWidth + 15);
      }

      if (left < 0) {
        left = 15;
      }

      if (top + popupHeight > window.innerHeight) {
        top = window.innerHeight - popupHeight;
      }

      return {
        top: `${top}px`,
        left: `${left}px`,
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
        data-popup="true"
      >
        <div ref={contentRef} className={styles.content}>
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
