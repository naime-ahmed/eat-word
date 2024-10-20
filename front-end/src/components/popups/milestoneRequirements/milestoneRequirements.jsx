import { useState } from "react";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn.jsx";
import styles from "./milestoneRequirements.module.css";

const TakeWeekRequirements = ({ isOpen, onClose }) => {
  const [newWeekFormData, setNewWeekFormData] = useState({
    numberOfWords: 35,
    learnSynonyms: false,
    includeDefinition: false,
    learningPlan: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setNewWeekFormData({ ...newWeekFormData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newWeekFormData);
    setNewWeekFormData({
      numberOfWords: 35,
      learnSynonyms: false,
      includeDefinition: false,
      learningPlan: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Let me know your preferences</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              name="numberOfWords"
              id="numberOfWords"
              min="10"
              max="100"
              value={newWeekFormData.numberOfWords}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
            <label htmlFor="numberOfWords" className={styles.formLabel}>
              How many words you want to learn?
            </label>
          </div>
          <div className={styles.inputGroup}>
            <select
              name="learningPlan"
              id="learningPlan"
              value={newWeekFormData.learningPlan}
              onChange={handleChange}
              className={styles.inputField}
              required
            >
              <option value="" disabled>
                Select a learning plan
              </option>
              <option value="7-Day Challenge">7-Day Challenge</option>
              <option value="3-Day Sprint">3-Day Sprint</option>
              <option value="Flexible Learning">Flexible Learning</option>
            </select>
            <label htmlFor="learningPlan" className={styles.formLabel}>
              Choose your learning plan
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
          <div className={styles.buttonGroup}>
            <PrimaryBtn btnType="submit" colorOne="#068200" colorTwo="#00a116">
              Let&#39;s goo
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
};

export default TakeWeekRequirements;
