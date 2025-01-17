import { useState } from "react";
import { useSelector } from "react-redux";
import { useAddMilestoneMutation } from "../../../../services/milestone.js";
import Notification from "../../../Notification/Notification.jsx";
import PrimaryBtn from "../../../ui/button/PrimaryBtn/PrimaryBtn.jsx";
import styles from "./MilestoneRequirements.module.css";

const MilestoneRequirements = ({ handleViewMilestone, onClose }) => {
  const [newWeekFormData, setNewWeekFormData] = useState({
    milestoneType: "",
    name: "",
    targetWords: 35,
    learnSynonyms: false,
    includeDefinition: false,
  });
  const [doNotify, setDoNotify] = useState(false);

  const { user } = useSelector((user) => user.auth);

  const [addMilestone, { isLoading, isError, error }] =
    useAddMilestoneMutation();

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setNewWeekFormData({ ...newWeekFormData, [name]: value });
  };

  const handleNotificationClose = () => {
    setDoNotify(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // try catch
    try {
      console.log(newWeekFormData);
      const newMilestoneData = {
        ...newWeekFormData,
        addedBy: user.id,
        wordsCount: 0,
        memorizedCount: 0,
        revisionCount: 0,
      };
      await addMilestone(newMilestoneData);
      if (isError) {
        return;
      }
      setNewWeekFormData({
        milestoneType: "",
        name: "",
        targetWords: 35,
        learnSynonyms: false,
        includeDefinition: false,
      });
      handleViewMilestone(newWeekFormData.milestoneType);
      localStorage.setItem("selectedMS", newWeekFormData.milestoneType);
      setDoNotify(false);
      onClose();
    } catch (error) {
      setDoNotify(true);
      console.log("error on append new challenge", error);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Let me know your preferences</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <select
            name="milestoneType"
            id="milestoneType"
            value={newWeekFormData.milestoneType}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="" disabled>
              Select a learning plan
            </option>
            <option value="seven">7-Day Challenge</option>
            <option value="three">3-Day Sprint</option>
            <option value="zero">Flexible Learning</option>
          </select>
          <label htmlFor="milestoneType" className={styles.formLabel}>
            Choose your learning plan
          </label>
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="name"
            id="name"
            value={newWeekFormData.name}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <label htmlFor="name" className={styles.formLabel}>
            Give it a name
          </label>
        </div>
        <div className={styles.inputGroup}>
          <input
            type="number"
            name="targetWords"
            id="targetWords"
            min="10"
            max="100"
            value={newWeekFormData.targetWords}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <label htmlFor="targetWords" className={styles.formLabel}>
            How many words you want to learn?
          </label>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="learnSynonyms"
            id="learnSynonyms"
            checked={newWeekFormData.learnSynonyms}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <label htmlFor="learnSynonyms" className={styles.checkboxLabel}>
            Want to learn synonyms as well?
          </label>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="includeDefinition"
            id="includeDefinition"
            checked={newWeekFormData.includeDefinition}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <label htmlFor="includeDefinition" className={styles.checkboxLabel}>
            Want to include English definition?
          </label>
        </div>
        {isError && <p>{error.data.message}</p>}
        <div className={styles.SubmitButton}>
          <PrimaryBtn btnType="submit" isLoading={isLoading}>
            Let&#39;s goo
          </PrimaryBtn>
        </div>
      </form>
      {doNotify && (
        <Notification
          title="Request failed"
          message={
            error?.data?.message ||
            "An error occurred while creating new challenge!"
          }
          isOpen={doNotify}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

export default MilestoneRequirements;
