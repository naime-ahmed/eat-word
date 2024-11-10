import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useRemoveMilestoneMutation } from "../../../services/milestone";
import { formatTimeAgo } from "../../../utils/formateTimeAgo";
import EditMilestone from "../../popups/EditMilestone/EditMilestone";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./MilestoneCard.module.css";

const MilestoneCard = ({ milestone }) => {
  const navigate = useNavigate();
  const id = milestone?._id;
  const [showFloatCard, setShowFloatCard] = useState(false);
  const floatCardRef = useRef(null);
  const ellipsisRef = useRef(null);
  const [isEditMilestonePopShown, setIsEditMilestonePopShown] = useState(false);

  const [removeMilestone, { isLoading, isError, error }] =
    useRemoveMilestoneMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        floatCardRef.current &&
        !floatCardRef.current.contains(event.target) &&
        !ellipsisRef.current.contains(event.target)
      ) {
        setShowFloatCard(false);
        setIsEditMilestonePopShown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleClick() {
    navigate(`/my-space/${id}`);
  }

  const handleEllipsisClick = (e) => {
    e.stopPropagation();
    setShowFloatCard(!showFloatCard);
  };

  const openEditMilestone = (e) => {
    e.stopPropagation();
    setIsEditMilestonePopShown(true);
  };
  const closeEditMilestone = () => setIsEditMilestonePopShown(false);

  const handleDelete = async () => {
    try {
      // Wait for the Swal result
      const warningResult = await Swal.fire({
        title: "Are you sure?",
        text: `"${milestone?.name}" will be deleted and you won't be able to restore it`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ok, delete",
      });

      // console.log(warningResult);

      // Check if the user confirmed the sign-out
      if (!warningResult.isConfirmed) {
        return;
      }

      const res = await removeMilestone(id);
      // inform the user
      Swal.fire({
        title: res.data?.message,
        icon: "success",
        confirmButtonText: "Got it",
      });
    } catch (error) {
      // show the error to user
      Swal.fire({
        title: "Something went wrong",
        text: error.data?.message || "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

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
        <div className={styles.milestoneName}>
          <p>{milestone?.name}</p>
        </div>
        <div
          ref={ellipsisRef}
          onClick={handleEllipsisClick}
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
        {showFloatCard && (
          <div
            ref={floatCardRef}
            className={styles.floatCard}
            onClick={handlePropagation}
          >
            <PrimaryBtn handleClick={openEditMilestone}>
              <i className="far fa-edit"></i> Edit
            </PrimaryBtn>
            <EditMilestone
              isOpen={isEditMilestonePopShown}
              onClose={closeEditMilestone}
              milestone={milestone}
              onCloseFloatCard={setShowFloatCard}
            />
            <PrimaryBtn
              colorOne="#da3633"
              colorTwo="#da3633"
              isLoading={isLoading}
              handleClick={handleDelete}
            >
              Delete
            </PrimaryBtn>
          </div>
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
