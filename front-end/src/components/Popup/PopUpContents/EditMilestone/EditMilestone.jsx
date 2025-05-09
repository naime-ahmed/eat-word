import PropTypes from "prop-types";
import { useState } from "react";
import useNotification from "../../../../hooks/useNotification";
import { useEditMilestoneMutation } from "../../../../services/milestone";
import { isEnded } from "../../../../utils/formateDate";
import { milestonePropTypes } from "../../../../utils/propTypes";
import PrimaryBtn from "../../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./EditMilestone.module.css";

function EditMilestone({ milestone, onClose }) {
  const [editedMilestone, setEditedMilestone] = useState({
    name: milestone?.name,
    targetWords: milestone?.targetWords,
  });
  const [hasChanges, setHasChanges] = useState(true);
  const showNotification = useNotification();
  const [editMilestone, { isLoading, isError, error }] =
    useEditMilestoneMutation();

  const handleChange = (e) => {
    setEditedMilestone({ ...editedMilestone, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (
        editedMilestone.name !== milestone?.name &&
        editedMilestone.targetWords !== milestone?.targetWords
      ) {
        await editMilestone([milestone?._id, editedMilestone]);
        onClose();
      } else if (editedMilestone.name !== milestone?.name) {
        await editMilestone([milestone?._id, { name: editedMilestone.name }]);
        onClose();
      } else if (editedMilestone.targetWords !== milestone?.targetWords) {
        await editMilestone([
          milestone?._id,
          { targetWords: editedMilestone.targetWords },
        ]);
        onClose();
      } else {
        setHasChanges(false);
        return;
      }
    } catch (error) {
      showNotification({
        title: "Failed to Edit!",
        message:
          error.data?.message ||
          error.message ||
          "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    }
  };

  return (
    <div data-popup="true" className={styles.modalContent}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="name"
            id="name"
            value={editedMilestone.name}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <label htmlFor="name" className={styles.formLabel}>
            Want to give it a new name?
          </label>
        </div>
        {!isEnded(milestone?.createdAt, milestone?.milestoneType) && (
          <div className={styles.inputGroup}>
            <input
              type="number"
              name="targetWords"
              id="targetWords"
              min="10"
              max="100"
              value={editedMilestone.targetWords}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
            <label htmlFor="targetWords" className={styles.formLabel}>
              Increase, decrease or keep it
            </label>
          </div>
        )}
        {isError && <p className={styles.editError}>{error.data.message}</p>}
        {!hasChanges && (
          <p className={styles.editError}>You have not changed anything! lol</p>
        )}
        <div className={styles.EditButton}>
          <PrimaryBtn btnType="submit" isLoading={isLoading}>
            Update Changes
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
}

EditMilestone.propTypes = {
  milestone: milestonePropTypes,
  onClose: PropTypes.func.isRequired,
};

export default EditMilestone;
