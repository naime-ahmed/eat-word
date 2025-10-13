import PropTypes from "prop-types";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import useNotification from "../../../../hooks/useNotification.js";
import { useAddMilestoneMutation } from "../../../../services/milestone.js";
import { LANGUAGE_MAP } from "../../../../utils/supportedLan.js";
import CustomSelect from "../../../ui/input/CustomSelect/CustomSelect.jsx";
import LanguageSearch from "../../../ui/input/LanguageSearch/LanguageSearch.jsx";
import styles from "./MilestoneRequirements.module.css";

const milestoneOptions = [
  { id: "seven", text: "7-Day Milestone" },
  { id: "three", text: "3-Day Sprint" },
  { id: "zero", text: "Flexible Learning" },
];

const StepProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <div className={styles.progressBarContainer}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <div
            key={i}
            className={`${styles.step} ${isCompleted ? styles.completed : ""} ${
              isActive ? styles.active : ""
            }`}
          >
            <div className={styles.stepNumber}>{stepNumber}</div>
          </div>
        );
      })}
    </div>
  );
};

StepProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
};

const NameStep = ({ value, onChange, error }) => (
  <div className={styles.stepContent}>
    <label htmlFor="name" className={styles.formLabel}>
      Give your milestone a name
    </label>
    <input
      type="text"
      name="name"
      id="name"
      value={value}
      onChange={onChange}
      className={`${styles.inputField} ${error ? styles.inputError : ""}`}
      placeholder="Mastering Fruits Name"
      required
    />
    {error && <p className={styles.fieldError}>{error}</p>}
  </div>
);

NameStep.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const PlanStep = ({
  milestoneType,
  targetWords,
  onMilestoneChange,
  onTargetWordsChange,
  errors,
}) => (
  <div className={styles.stepContent}>
    <div className={styles.inputGroup}>
      <label htmlFor="milestoneType" className={styles.formLabel}>
        Choose your learning plan
      </label>
      <CustomSelect
        value={
          milestoneOptions.find((opt) => opt.id === milestoneType)?.text || ""
        }
        onChange={onMilestoneChange}
        options={milestoneOptions}
        placeholder="Select a plan"
        customStyles={{
          width: "100%",
          padding: "12px 16px",
          backgroundColor: "#151e2d",
          borderColor: errors.milestoneType ? "#f87171" : "#2d3a50",
        }}
      />
      {errors.milestoneType && (
        <p className={styles.fieldError}>{errors.milestoneType}</p>
      )}
    </div>
    <div className={styles.inputGroup}>
      <label htmlFor="targetWords" className={styles.formLabel}>
        How many words to learn?
      </label>
      <input
        type="number"
        name="targetWords"
        id="targetWords"
        min="10"
        max="100"
        value={targetWords}
        onChange={onTargetWordsChange}
        className={`${styles.inputField} ${
          errors.targetWords ? styles.inputError : ""
        }`}
        required
      />
      {errors.targetWords && (
        <p className={styles.fieldError}>{errors.targetWords}</p>
      )}
    </div>
  </div>
);

PlanStep.propTypes = {
  milestoneType: PropTypes.string.isRequired,
  targetWords: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onMilestoneChange: PropTypes.func.isRequired,
  onTargetWordsChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const LanguageStep = ({
  comfortableLang,
  learningLang,
  onComfortableLangChange,
  onLearningLangChange,
  errors,
}) => (
  <div className={styles.stepContent}>
    <div className={styles.inputGroup}>
      <label htmlFor="comfortableLang" className={styles.formLabel}>
        Language you know
      </label>
      <LanguageSearch
        onSelectLanguage={onComfortableLangChange}
        curLang={comfortableLang}
        fieldId="comfortableLang"
        isRequired={true}
        error={errors.comfortableLang}
      />
      {errors.comfortableLang && (
        <p className={styles.fieldError}>{errors.comfortableLang}</p>
      )}
    </div>
    <div className={styles.inputGroup}>
      <label htmlFor="learningLang" className={styles.formLabel}>
        Language you want to learn
      </label>
      <LanguageSearch
        onSelectLanguage={onLearningLangChange}
        curLang={learningLang}
        fieldId="learningLang"
        isRequired={true}
        error={errors.learningLang}
      />
      {errors.learningLang && (
        <p className={styles.fieldError}>{errors.learningLang}</p>
      )}
    </div>
  </div>
);

LanguageStep.propTypes = {
  comfortableLang: PropTypes.string.isRequired,
  learningLang: PropTypes.string.isRequired,
  onComfortableLangChange: PropTypes.func.isRequired,
  onLearningLangChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const OptionsStep = ({ learnSynonyms, includeDefinition, onChange }) => (
  <div className={styles.stepContent}>
    <label className={styles.checkboxGroup}>
      <input
        type="checkbox"
        name="learnSynonyms"
        checked={learnSynonyms}
        onChange={onChange}
        className={styles.checkbox}
      />
      <span className={styles.checkboxLabel}>
        Want to learn synonyms as well?
      </span>
    </label>
    <label className={styles.checkboxGroup}>
      <input
        type="checkbox"
        name="includeDefinition"
        checked={includeDefinition}
        onChange={onChange}
        className={styles.checkbox}
      />
      <span className={styles.checkboxLabel}>
        Want to include English definition?
      </span>
    </label>
  </div>
);

OptionsStep.propTypes = {
  learnSynonyms: PropTypes.bool.isRequired,
  includeDefinition: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const MilestoneRequirements = ({ handleViewMilestone, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    milestoneType: "",
    name: "",
    comfortableLang: "",
    learningLang: "",
    targetWords: 35,
    learnSynonyms: false,
    includeDefinition: false,
  });
  const [errors, setErrors] = useState({});

  const language_map = LANGUAGE_MAP();
  const showNotification = useNotification();
  const { user } = useSelector((state) => state.auth);
  const [addMilestone, { isLoading }] = useAddMilestoneMutation();

  const totalSteps = 4;

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        break;
      case 2:
        if (!formData.milestoneType)
          newErrors.milestoneType = "Please select a plan.";
        if (formData.targetWords < 10 || formData.targetWords > 100)
          newErrors.targetWords = "Target must be between 10 and 100.";
        break;
      case 3:
        if (!formData.comfortableLang)
          newErrors.comfortableLang = "Please select your language.";
        if (!formData.learningLang)
          newErrors.learningLang = "Please select a language to learn.";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    clearError(name);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMilestoneTypeChange = (value) => {
    clearError("milestoneType");
    const milestone = milestoneOptions.find((opt) => opt.text === value);
    if (milestone) {
      setFormData((prev) => ({ ...prev, milestoneType: milestone.id }));
    }
  };

  const handleSelectComfortableLanguage = (languageCode) => {
    clearError("comfortableLang");
    setFormData((prev) => ({
      ...prev,
      comfortableLang: language_map[languageCode],
    }));
  };

  const handleSelectLearningLanguage = (languageCode) => {
    clearError("learningLang");
    setFormData((prev) => ({
      ...prev,
      learningLang: language_map[languageCode],
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a consolidated error object
    let allErrors = {};
    for (let i = 1; i <= totalSteps; i++) {
      const stepErrors = {};
      switch (i) {
        case 1:
          if (!formData.name.trim()) stepErrors.name = "Name is required.";
          break;
        case 2:
          if (!formData.milestoneType)
            stepErrors.milestoneType = "Please select a plan.";
          if (formData.targetWords < 10 || formData.targetWords > 100)
            stepErrors.targetWords = "Target must be between 10 and 100.";
          break;
        case 3:
          if (!formData.comfortableLang)
            stepErrors.comfortableLang = "Please select your language.";
          if (!formData.learningLang)
            stepErrors.learningLang = "Please select a language to learn.";
          break;
        default:
          break;
      }
      allErrors = { ...allErrors, ...stepErrors };
    }

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      // Find the first step with an error and navigate to it
      if (allErrors.name) {
        setCurrentStep(1);
      } else if (allErrors.milestoneType || allErrors.targetWords) {
        setCurrentStep(2);
      } else if (allErrors.comfortableLang || allErrors.learningLang) {
        setCurrentStep(3);
      }
      return;
    }

    try {
      const newMilestoneData = {
        ...formData,
        addedBy: user.id,
        wordsCount: 0,
        memorizedCount: 0,
        revisionCount: 0,
      };
      await addMilestone(newMilestoneData).unwrap();
      localStorage.setItem("selectedMS", formData.milestoneType);
      showNotification({
        title: "Success!",
        message: "New milestone created successfully.",
        iconType: "success",
      });
      handleViewMilestone(formData.milestoneType);
      onClose();
    } catch (err) {
      showNotification({
        title: "Request Failed",
        message:
          err.data?.message ||
          "An error occurred while creating the milestone.",
        iconType: "error",
      });
      console.error("Error creating milestone:", err);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Create Your Learning Milestone</h2>
      <p className={styles.modalSubtitle}>
        Step {currentStep} of {totalSteps}: Get started on your learning plan.
      </p>
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.stepContainer}>
          {currentStep === 1 && (
            <NameStep
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          )}
          {currentStep === 2 && (
            <PlanStep
              milestoneType={formData.milestoneType}
              targetWords={formData.targetWords}
              onMilestoneChange={handleMilestoneTypeChange}
              onTargetWordsChange={handleChange}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <LanguageStep
              comfortableLang={formData.comfortableLang}
              learningLang={formData.learningLang}
              onComfortableLangChange={handleSelectComfortableLanguage}
              onLearningLangChange={handleSelectLearningLanguage}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <OptionsStep
              learnSynonyms={formData.learnSynonyms}
              includeDefinition={formData.includeDefinition}
              onChange={handleChange}
            />
          )}
        </div>

        <div className={styles.navigationButtons}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className={`${styles.navButton} ${styles.prevButton}`}
            >
              <FaChevronLeft />
              <span>Previous</span>
            </button>
          )}
          {currentStep < totalSteps && (
            <button
              type="button"
              onClick={handleNext}
              className={`${styles.navButton} ${styles.nextButton}`}
              disabled={
                errors.name ||
                errors.milestoneType ||
                errors.targetWords ||
                errors.comfortableLang ||
                errors.learningLang
              }
            >
              <span>Next</span>
              <FaChevronRight />
            </button>
          )}
          {currentStep === totalSteps && (
            <button
              type="submit"
              className={`${styles.navButton} ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Create Milestone"}
            </button>
          )}
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
