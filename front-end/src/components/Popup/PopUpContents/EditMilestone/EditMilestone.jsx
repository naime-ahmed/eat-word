import { useState } from "react";
import Swal from "sweetalert2";
import { useEditMilestoneMutation } from "../../../../services/milestone";
import PrimaryBtn from "../../../ui/button/PrimaryBtn/PrimaryBtn";
import styles from "./EditMilestone.module.css";

function EditMilestone({ isOpen, onClose, milestone, onCloseFloatCard }) {
  const [editedMilestone, setEditedMilestone] = useState({
    name: milestone?.name,
    targetWords: milestone?.targetWords,
  });
  const [editMilestone, { isLoading, isError, error }] =
    useEditMilestoneMutation();

  const handleChange = (e) => {
    setEditedMilestone({ ...editedMilestone, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(editedMilestone);

    await editMilestone([editedMilestone, milestone?._id]);
    if (isError) {
      // show the error to user
      Swal.fire({
        title: "Something went wrong",
        text: error.data?.message || "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
    onClose();
    onCloseFloatCard(false);
  };

  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
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
              Give it a new name
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
          <div className={styles.buttonGroup}>
            <PrimaryBtn
              btnType="submit"
              colorOne="#068200"
              colorTwo="#00a116"
              isLoading={isLoading}
            >
              Edit
            </PrimaryBtn>
            <PrimaryBtn
              btnType="button"
              handleClick={onClose}
              colorOne="#b30000"
              colorTwo="#d00000"
            >
              Cancel
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMilestone;
