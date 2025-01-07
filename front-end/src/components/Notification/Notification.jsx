import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import styles from "./Notification.module.css";

const Notification = ({ title, message, isOpen, onClose }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    let timeout;

    if (visible) {
      timeout = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000); // Close after 3 seconds
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [visible, onClose]);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={styles.notification}>
      <div className={styles.content}>
        <MdOutlineDone className={styles.icon} />
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
