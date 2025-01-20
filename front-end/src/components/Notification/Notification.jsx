import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiMessageAltError } from "react-icons/bi";
import { LuCircleCheckBig, LuMessageSquareWarning } from "react-icons/lu";
import styles from "./Notification.module.css";

const Notification = ({
  title,
  message,
  iconType = "warning",
  isOpen,
  onClose,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(isOpen);
  useEffect(() => {
    let timeout;

    if (visible) {
      timeout = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [visible, onClose, duration]);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);
  const icons = {
    error: <BiMessageAltError className={styles.error} />,
    warning: <LuMessageSquareWarning className={styles.warning} />,
    success: <LuCircleCheckBig className={styles.success} />,
  };

  if (!visible) return null;

  return createPortal(
    <div className={styles.notification}>
      <div className={styles.content}>
        {icons[iconType] && icons[iconType]}
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Notification;
