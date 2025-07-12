import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import useNotification from "../../../../hooks/useNotification.js";
import { useAddMilestoneMutation } from "../../../../services/milestone.js";
import { LANGUAGE_MAP } from "../../../../utils/supportedLan.js";
import PrimaryBtn from "../../../ui/button/PrimaryBtn/PrimaryBtn.jsx";
import LanguageSearch from "../../../ui/input/LanguageSearch/LanguageSearch.jsx";
import styles from "./MilestoneRequirements.module.css";

const MilestoneRequirements = ({ handleViewMilestone, onClose }) => {
  const [newWeekFormData, setNewWeekFormData] = useState({
    milestoneType: "",
    name: "",
    comfortableLang: "",
    learningLang: "",
    targetWords: 35,
    learnSynonyms: false,
    includeDefinition: false,
  });
  const language_map = LANGUAGE_MAP();

  const showNotification = useNotification();
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

  const handleSelectComfortableLanguage = (languageCode) => {
    console.log("comp lang", languageCode);
    setNewWeekFormData((prev) => ({
      ...prev,
      comfortableLang: language_map[languageCode],
    }));
  };

  const handleSelectLearningLanguage = (languageCode) => {
    console.log("learning lang", languageCode);
    setNewWeekFormData((prev) => ({
      ...prev,
      learningLang: language_map[languageCode],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
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

      onClose();
    } catch (error) {
      showNotification({
        title: "Request failed",
        message: "An error occurred while creating new milestone!",
        iconType: "error",
        duration: 4000,
      });
      console.log("error on append new milestone", error);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Your preferences</h2>
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
            <option value="seven">7-Day Milestone</option>
            <option value="three">3-Day Sprint</option>
            <option value="zero">Flexible Learning</option>
          </select>
          <label htmlFor="milestoneType" className={styles.formLabel}>
            Choose your learning plan
          </label>
          <div className={styles.selectArrow}></div>
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
          <label htmlFor="comfortableLang" className={styles.LangFormLabel}>
            Language you know
          </label>
          <LanguageSearch
            onSelectLanguage={handleSelectComfortableLanguage}
            curLang={newWeekFormData.comfortableLang}
            inlineStyles={{
              width: "100%",
              padding: "14px 16px",
              backgroundColor: "#151e2d",
            }}
            fieldId="comfortableLang"
            isRequired={true}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="learningLang" className={styles.LangFormLabel}>
            Language you want learn
          </label>
          <LanguageSearch
            onSelectLanguage={handleSelectLearningLanguage}
            curLang={newWeekFormData.learningLang}
            inlineStyles={{
              width: "100%",
              padding: "14px 16px",
              backgroundColor: "#151e2d",
            }}
            fieldId="learningLang"
            isRequired={true}
          />
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

        {isError && <p className={styles.errorMessage}>{error.data.message}</p>}

        <div className={styles.submitButton}>
          <PrimaryBtn btnType="submit" isLoading={isLoading}>
            Set New Milestone
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

MilestoneRequirements.propTypes = {
  handleViewMilestone: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MilestoneRequirements;
