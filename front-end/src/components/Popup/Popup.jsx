import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { incrementPopupZIndex } from "../../features/popupZIndexSlice";
import styles from "./Popup.module.css";

const POPUP_TYPES = {
  modal: {
    hasOverlay: true,
    preventScrollDefault: true,
    getPosition: () => ({
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }),
    contentClass: styles.modal,
    closeButtonClass: styles.closeButton,
  },
  menu: {
    hasOverlay: false,
    preventScrollDefault: false,
    getPosition: (clickPosition, popupDimensions, isMobile) => {
      let left = clickPosition.x + 15;
      let top = clickPosition.y + 15;

      if (isMobile) {
        left = clickPosition.x - popupDimensions.width;
      }

      if (left + popupDimensions.width > window.innerWidth) {
        left = window.innerWidth - (popupDimensions.width + 15);
      }
      if (left < 0) left = 15;

      return { top: `${top}px`, left: `${left}px` };
    },
    contentClass: styles.menu,
    closeButtonClass: styles.closeButton,
  },
  dialog: {
    hasOverlay: true,
    preventScrollDefault: true,
    getPosition: () => ({
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }),
    contentClass: styles.dialog,
    closeButtonClass: styles.dialogClose,
  },
};

const usePopupPosition = (popupConfig, isOpen, clickPosition, contentRef) => {
  const [popupDimensions, setPopupDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [position, setPosition] = useState({});
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setPopupDimensions({ width, height });
      setIsPositioned(true);
    }
  }, [isOpen, contentRef]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const isMobile = window.innerWidth <= 600;
      const newPosition = popupConfig.getPosition(
        clickPosition,
        popupDimensions,
        isMobile
      );
      setPosition(newPosition);
    }
  }, [isOpen, clickPosition, popupDimensions, popupConfig, contentRef]);

  return { position, isPositioned };
};

const useScrollPrevention = (isOpen, popupConfig, isPreventScroll) => {
  useEffect(() => {
    const shouldPreventScroll =
      isPreventScroll || (isOpen && popupConfig.preventScrollDefault);
    document.body.style.overflow = shouldPreventScroll ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen, popupConfig, isPreventScroll]);
};

const Popup = ({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  showCloseButton = true,
  children,
  popupType = "modal",
  clickPosition = null,
  isPreventScroll = false,
}) => {
  const dispatch = useDispatch();
  const zIndex = useSelector((state) => state.popupZIndex.popupZIndex);
  const popupRef = useRef(null);
  const contentRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const popupConfig = POPUP_TYPES[popupType];

  const { position, isPositioned } = usePopupPosition(
    popupConfig,
    isOpen,
    clickPosition,
    contentRef
  );

  useScrollPrevention(isOpen, popupConfig, isPreventScroll);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) dispatch(incrementPopupZIndex());
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isInsidePopup = e.target.closest('[data-popup="true"]');
      if (
        closeOnOutsideClick &&
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !isInsidePopup
      ) {
        handleClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, closeOnOutsideClick, handleClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <PopupOverlay popupConfig={popupConfig} zIndex={zIndex}>
      <div ref={popupRef} onClick={(e) => e.stopPropagation()}>
        <PopupContent
          popupConfig={popupConfig}
          position={position}
          isPositioned={isPositioned}
          isClosing={isClosing}
          contentRef={contentRef}
          showCloseButton={showCloseButton}
          handleClose={handleClose}
          zIndex={zIndex}
        >
          {children}
        </PopupContent>
      </div>
    </PopupOverlay>,
    document.body
  );
};

const PopupContent = ({
  popupConfig,
  position,
  isPositioned,
  isClosing,
  contentRef,
  showCloseButton,
  handleClose,
  children,
  zIndex,
}) => (
  <div
    ref={contentRef}
    className={`${popupConfig.contentClass} ${isClosing ? styles.closing : ""}`}
    style={{
      ...position,
      visibility: isPositioned ? "visible" : "hidden",
      zIndex,
    }}
    data-popup="true"
  >
    <div className={styles.content}>
      {showCloseButton && (
        <button className={popupConfig.closeButtonClass} onClick={handleClose}>
          <IoClose />
        </button>
      )}
      {children}
    </div>
  </div>
);

const PopupOverlay = ({ popupConfig, zIndex, children }) =>
  popupConfig.hasOverlay ? (
    <div className={styles.overlay} style={{ zIndex }}>
      {children}
    </div>
  ) : (
    children
  );

// props types
Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  closeOnOutsideClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  children: PropTypes.node.isRequired,
  popupType: PropTypes.oneOf(Object.keys(POPUP_TYPES)),
  clickPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  isPreventScroll: PropTypes.bool,
};

PopupContent.propTypes = {
  popupConfig: PropTypes.shape({
    hasOverlay: PropTypes.bool.isRequired,
    preventScrollDefault: PropTypes.bool.isRequired,
    getPosition: PropTypes.func.isRequired,
    contentClass: PropTypes.string.isRequired,
    closeButtonClass: PropTypes.string.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    top: PropTypes.string,
    left: PropTypes.string,
    transform: PropTypes.string,
  }).isRequired,
  isPositioned: PropTypes.bool.isRequired,
  isClosing: PropTypes.bool.isRequired,
  contentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  showCloseButton: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  zIndex: PropTypes.number.isRequired,
};

PopupOverlay.propTypes = {
  popupConfig: PropTypes.shape({
    hasOverlay: PropTypes.bool.isRequired,
    preventScrollDefault: PropTypes.bool.isRequired,
    getPosition: PropTypes.func.isRequired,
    contentClass: PropTypes.string.isRequired,
    closeButtonClass: PropTypes.string.isRequired,
  }).isRequired,
  zIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default Popup;
