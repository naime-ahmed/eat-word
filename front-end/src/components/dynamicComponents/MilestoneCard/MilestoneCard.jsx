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
      <div className={styles.milestoneMainContent}>
        <div className={styles.milestoneNum}>
          <p>{milestone?.name}</p>
        </div>
        {milestone?.memorizedCount === 0 && milestone?.revisionCount === 0 ? (
          <div className={styles.curWordCount} title="Number of current words">
            W : {milestone?.wordsCount}
          </div>
        ) : (
          <div className={styles.wordVerdict}>
            <p title="Memorized">{milestone?.memorizedCount}</p>
            <p title="Required revision">{milestone?.revisionCount}</p>
          </div>
        )}
      </div>
      <p className={styles.milestoneCardLastEdit}>
        Edited: {formatTimeAgo(milestone?.updatedAt)}
      </p>
    </div>
  );
};

export default MilestoneCard;
