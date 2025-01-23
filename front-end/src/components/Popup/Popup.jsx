import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { incrementPopupZIndex } from "../../features/popupZIndexSlice";
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
  const [isPositioned, setIsPositioned] = useState(false); // Track if positioned
  const dispatch = useDispatch();
  const zIndex = useSelector((state) => state.popupZIndex.popupZIndex);

  // Increment z-index when the popup opens
  useEffect(() => {
    if (isOpen) {
      dispatch(incrementPopupZIndex());
    }
  }, [isOpen, dispatch]);

  // Measure dimensions and calculate position
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setPopupDimensions({ width, height });
      setIsPositioned(true);
    }
  }, [isOpen, children]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      e.stopPropagation();
      const isInsidePopup = e.target.closest('[data-popup="true"]');
      if (
        closeOnOutsideClick &&
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !isInsidePopup
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, closeOnOutsideClick, onClose]);

  // Remove scroll
  useEffect(() => {
    if (isOpen && popupType !== "menu") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen, popupType]);

  // Calculate popup position
  const getPopupStyle = () => {
    if (popupType === "menu" && clickPosition) {
      const { width: popupWidth, height: popupHeight } = popupDimensions;
      let left = clickPosition.x + 15;
      let top = clickPosition.y + 15;

      // Mobile adjustments
      if (window.innerWidth <= 600) {
        left = clickPosition.x - popupWidth - 15;
      }

      // Prevent overflow
      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - (popupWidth + 15);
      }
      if (left < 0) left = 15;
      if (top + popupHeight > window.innerHeight) {
        top = window.innerHeight - popupHeight;
      }

      return { top: `${top}px`, left: `${left}px` };
    }
    return {};
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`${
        popupType === "modal" || popupType === "dialog" ? styles.overlay : ""
      }`}
      style={{ zIndex }}
    >
      <div
        ref={popupRef}
        className={styles[popupType]}
        style={{
          ...getPopupStyle(),
          zIndex,
          visibility: isPositioned ? "visible" : "hidden",
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
