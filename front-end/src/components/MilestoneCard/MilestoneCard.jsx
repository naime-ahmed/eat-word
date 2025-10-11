import { useCallback, useEffect, useRef, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../utils/formateTimeAgo";
import { milestonePropTypes } from "../../utils/propTypes";
import Popup from "../Popup/Popup";
import MilestoneMenu from "../Popup/PopUpContents/MilestoneMenu/MilestoneMenu";
import ShinyText from "../ui/Text/ShinyText/ShinyText";
import styles from "./MilestoneCard.module.css";

const MilestoneCard = ({ milestone }) => {
  const navigate = useNavigate();
  const id = milestone?._id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ellipsisRef = useRef(null);
  const [clickPosition, setClickPosition] = useState(null);

  // Check if the milestone is in progress
  const duration = milestone?.milestoneType === "three" ? 3 : 7;
  const createdDate = new Date(milestone.createdAt);
  const targetDate = new Date(
    createdDate.getTime() + duration * 24 * 60 * 60 * 1000
  );
  const currentDate = new Date();

  // --- Progressive Border Logic ---
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const [strokeDasharray, setStrokeDasharray] = useState(0);
  const topPathRef = useRef(null);
  const bottomPathRef = useRef(null);

  useEffect(() => {
    const topPath = topPathRef.current;
    const bottomPath = bottomPathRef.current;

    if (topPath && bottomPath) {
      const pathLength = topPath.getTotalLength();
      setStrokeDasharray(pathLength);

      const paths = [topPath, bottomPath];
      const hoverPaths = topPath.ownerSVGElement.querySelectorAll(
        `.${styles.progressPathHover}`
      );

      [...paths, ...hoverPaths].forEach((p) => {
        p.style.transition = "none";
      });

      setStrokeDashoffset(pathLength);
      topPath.getBoundingClientRect();

      const animationTimeout = setTimeout(() => {
        [...paths, ...hoverPaths].forEach((p) => {
          p.style.transition = "";
        });

        const progress = Math.min(
          (milestone?.wordsCount || 0) / (milestone?.targetWords || 1),
          1
        );
        const finalOffset = pathLength * (1 - progress);
        setStrokeDashoffset(finalOffset);
      }, 50);

      return () => clearTimeout(animationTimeout);
    }
  }, [milestone]);

  function handleClick() {
    navigate(`/words/${id}`);
  }

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

  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      key={milestone?._id}
      className={styles.milestoneCard}
    >
      {/* Progressive SVG Border */}
      <svg
        className={styles.progressBorder}
        viewBox="0 0 291 110"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#13356B" />
            <stop offset="100%" stopColor="#1C66B0" />
          </linearGradient>
          <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1C66B0" />
            <stop offset="100%" stopColor="#13356B" />
          </linearGradient>
        </defs>

        {/* Normal State Paths */}
        <path
          ref={topPathRef}
          d="M 1 55 L 1 10 A 9 9 0 0 1 10 1 L 281 1 A 9 9 0 0 1 290 10 L 290 55"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          className={`${styles.progressPath} ${styles.progressPathTop}`}
          style={{ strokeDasharray, strokeDashoffset }}
        />
        <path
          ref={bottomPathRef}
          d="M 1 55 L 1 100 A 9 9 0 0 0 10 109 L 281 109 A 9 9 0 0 0 290 100 L 290 55"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          className={`${styles.progressPath} ${styles.progressPathBottom}`}
          style={{ strokeDasharray, strokeDashoffset }}
        />

        {/* Hover State Paths */}
        <path
          d="M 1 55 L 1 10 A 9 9 0 0 1 10 1 L 281 1 A 9 9 0 0 1 290 10 L 290 55"
          fill="none"
          stroke="url(#hoverGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          className={`${styles.progressPathHover} ${styles.progressPathTop}`}
          style={{ strokeDasharray, strokeDashoffset }}
        />
        <path
          d="M 1 55 L 1 100 A 9 9 0 0 0 10 109 L 281 109 A 9 9 0 0 0 290 100 L 290 55"
          fill="none"
          stroke="url(#hoverGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          className={`${styles.progressPathHover} ${styles.progressPathBottom}`}
          style={{ strokeDasharray, strokeDashoffset }}
        />
      </svg>

      <div className={styles.milestoneNameAndEdit}>
        {milestone?.pinned && (
          <span className={styles.pinned}>
            <BsPinAngleFill />
          </span>
        )}
        <div
          className={`${styles.milestoneName} ${
            milestone.wordsCount === milestone.targetWords
              ? styles.milestoneReached
              : ""
          }`}
        >
          {currentDate < targetDate ? (
            <ShinyText
              text={milestone.name}
              speed={3}
              style={{ fontSize: "1rem", fontWeight: "bold" }}
            />
          ) : (
            <div style={{ color: "#b5b5b5a4" }}>{milestone.name}</div>
          )}
        </div>
        <div
          ref={ellipsisRef}
          onClick={handleMenusOpen}
          className={styles.editEllipsis}
        >
          <HiDotsVertical />
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
            <p title="Number of memorized words" onClick={handlePropagation}>
              {milestone?.memorizedCount}
            </p>
            <p title="Revision required" onClick={handlePropagation}>
              {milestone?.revisionCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
MilestoneCard.propTypes = {
  milestone: milestonePropTypes,
};
export default MilestoneCard;
