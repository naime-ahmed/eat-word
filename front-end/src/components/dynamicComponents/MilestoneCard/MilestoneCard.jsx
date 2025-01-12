import { useCallback, useRef, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../../utils/formateTimeAgo";
import Popup from "../../Popup/Popup";
import MilestoneMenu from "../../Popup/PopUpContents/MilestoneMenu/MilestoneMenu";
import styles from "./MilestoneCard.module.css";

const MilestoneCard = ({ milestone }) => {
  const navigate = useNavigate();
  const id = milestone?._id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ellipsisRef = useRef(null);
  const [clickPosition, setClickPosition] = useState(null);

  function handleClick() {
    navigate(`/my-space/${id}`);
  }

  // handle the menu on and off
  const handleMenusOpen = (e) => {
    e.stopPropagation();
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    setClickPosition({ x, y });
    setIsMenuOpen(true);
  };
  const handleMenusClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // stop ellipse, metrics on click navigation
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      key={milestone?._id}
      className={styles.milestoneCard}
    >
      <div className={styles.milestoneNameAndEdit}>
        {milestone?.pinned && (
          <span className={styles.pinned}>
            <BsPinAngleFill />
          </span>
        )}
        <div className={styles.milestoneName}>
          <p>{milestone?.name}</p>
        </div>
        <div
          ref={ellipsisRef}
          onClick={handleMenusOpen}
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
        {isMenuOpen && (
          <Popup
            isOpen={isMenuOpen}
            onClose={handleMenusClose}
            popupType="menu"
            clickPosition={clickPosition}
            showCloseButton={false}
          >
            <MilestoneMenu
              milestone={milestone}
              onMenuClose={handleMenusClose}
            />
          </Popup>
        )}
      </div>
      <div className={styles.milestoneInfo}>
        <p className={styles.milestoneCardLastEdit}>
          Edited: {formatTimeAgo(milestone?.updatedAt)}
        </p>
        {milestone?.memorizedCount === 0 && milestone?.revisionCount === 0 ? (
          <div className={styles.curWordCount}>
            <span title="Number of current words" onClick={handlePropagation}>
              W : {milestone?.wordsCount}
            </span>
            <span title="Number of targeted words" onClick={handlePropagation}>
              T : {milestone?.targetWords}
            </span>
          </div>
        ) : (
          <div className={styles.wordVerdict}>
            <p title="Memorized" onClick={handlePropagation}>
              {milestone?.memorizedCount}
            </p>
            <p title="Required revision" onClick={handlePropagation}>
              {milestone?.revisionCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
