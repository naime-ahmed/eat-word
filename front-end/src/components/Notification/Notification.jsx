import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiMessageAltError } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { LuCircleCheckBig, LuMessageSquareWarning } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../features/notificationSlice";
import styles from "./Notification.module.css";

const Notification = ({
  id,
  icon = null,
  title = "",
  message = "",
  iconType = "warning",
  onClose,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

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

  const handleClose = () => {
    setVisible(false);
    onClose(id);
  };

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

const NotificationContainer = () => {
  const notifications = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={handleClose}
        />
      ))}
    </>
  );
};

export default NotificationContainer;
