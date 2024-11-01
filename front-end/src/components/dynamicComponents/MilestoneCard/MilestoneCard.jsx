import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../../utils/formateTimeAgo";
import styles from "./MilestoneCard.module.css";

const MilestoneCard = ({ milestone }) => {
  const navigate = useNavigate();
  const id = milestone?._id;

  function handleClick() {
    navigate(`/my-space/${id}`);
  }

  return (
    <div
      onClick={handleClick}
      key={milestone?._id}
      className={styles.milestoneCard}
    >
      <div className={styles.milestoneNameAndEdit}>
        <div className={styles.milestoneName}>
          <p>{milestone?.name}</p>
        </div>
        <div>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
      </div>
      <div className={styles.milestoneInfo}>
        <p className={styles.milestoneCardLastEdit}>
          Edited: {formatTimeAgo(milestone?.updatedAt)}
        </p>
        {milestone?.memorizedCount === 0 && milestone?.revisionCount === 0 ? (
          <div className={styles.curWordCount}>
            <span title="Number of current words">
              W : {milestone?.wordsCount}
            </span>
            <span title="Number of targeted words">
              T : {milestone?.targetWords}
            </span>
          </div>
        ) : (
          <div className={styles.wordVerdict}>
            <p title="Memorized">{milestone?.memorizedCount}</p>
            <p title="Required revision">{milestone?.revisionCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
