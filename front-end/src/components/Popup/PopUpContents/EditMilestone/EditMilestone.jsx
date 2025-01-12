import { useState } from "react";
import { useEditMilestoneMutation } from "../../../../services/milestone";
import Notification from "../../../Notification/Notification";
import PrimaryBtn from "../../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./EditMilestone.module.css";

function EditMilestone({ milestone, onClose }) {
  const [editedMilestone, setEditedMilestone] = useState({
    name: milestone?.name,
    targetWords: milestone?.targetWords,
  });
  const [hasChanges, setHasChanges] = useState(true);

  const [editMilestone, { isLoading, isError, error }] =
    useEditMilestoneMutation();

  const handleChange = (e) => {
    setEditedMilestone({ ...editedMilestone, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(editedMilestone);

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
    } catch {
      <Notification
        title="Failed to Edit!"
        message={error?.data?.message || "Something went wrong while editing!"}
      />;
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
        {isError && <p>{error.data.message}</p>}
        {!hasChanges && <p>You have not changed anything! lol</p>}
        <div className={styles.EditButton}>
          <PrimaryBtn btnType="submit" isLoading={isLoading}>
            Update Changes
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
}

export default EditMilestone;
