import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiMessageAltError } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { LuCircleCheckBig, LuMessageSquareWarning } from "react-icons/lu";
import styles from "./Notification.module.css";

const Notification = ({
  title,
  message,
  iconType = "warning",
  isOpen,
  onClose,
  duration = 4000,
  icon, // New prop for custom icons
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [progress, setProgress] = useState(100);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  useEffect(() => {
    let timeout;
    let interval;

    if (visible) {
      // Progress bar animation
      interval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 100 / (duration / 50)));
      }, 50);

      // Auto-close timeout
      timeout = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [visible, duration]);

  useEffect(() => {
    setVisible(isOpen);
    if (isOpen) setProgress(100);
  }, [isOpen]);

  const defaultIcons = {
    error: <BiMessageAltError className={styles.error} />,
    warning: <LuMessageSquareWarning className={styles.warning} />,
    success: <LuCircleCheckBig className={styles.success} />,
  };

  if (!visible) return null;

  return createPortal(
    <div className={styles.notification}>
      <button className={styles.closeButton} onClick={handleClose}>
        <IoClose />
      </button>

      <div className={styles.content}>
        {icon || defaultIcons[iconType]}
        <div className={styles.textContainer}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>,
    document.body
  );
};

export default Notification;
