import { useState } from "react";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn.jsx";
import styles from "./TakeWeekRequirements.module.css";

const TakeWeekRequirements = ({ isOpen, onClose }) => {
  const [newWeekFormData, setNewWeekFormData] = useState({
    numberOfWords: 35,
    learnSynonyms: false,
    includeDefinition: false,
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
              min="28"
              max="100"
              value={newWeekFormData.numberOfWords}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
            <label htmlFor="numberOfWords" className={styles.formLabel}>
              Weekly word learning goal. 35 is ideal
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
