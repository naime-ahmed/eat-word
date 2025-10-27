import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useGenerateQuizzesMutation } from "../../../services/generativeAi";
import SliderInput from "../SliderInput/SliderInput";
import styles from "./QuizContentGenerator.module.css";

export default function QuizContentGenerator({
  milestoneId,
  currentWordCount,
  targetedWordCount,
  onClose,
  onGenerated,
  userSubscriptionType,
}) {
  const [quizCount, setQuizCount] = useState(10);
  const [generatedData, setGeneratedData] = useState(null);

  const [generateQuiz, { isLoading, isError, error }] =
    useGenerateQuizzesMutation();

  // Store quiz data in localStorage when received
  useEffect(() => {
    if (generatedData?.quiz && milestoneId) {
      try {
        localStorage.setItem(
          `quiz_${milestoneId}`,
          JSON.stringify(generatedData.quiz)
        );
        console.log(`Quiz data stored for milestone ${milestoneId}`);
      } catch (err) {
        console.error("Failed to store quiz data in localStorage:", err);
      }
    }
  }, [generatedData, milestoneId]);

  const handleQuizDataGenerate = async () => {
    try {
      const quizData = await generateQuiz([milestoneId, quizCount]).unwrap();
      console.log("quiz data: ", quizData);
      setGeneratedData(quizData);
      onGenerated(quizData);
    } catch (err) {
      console.error("Failed to generate quizzes:", err);
    }
  };

  // Show only loading state when generating
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <h3 className={styles.loadingTitle}>Generating Quizzes</h3>
          <p className={styles.loadingText}>
            Please wait while we create {quizCount} quizzes for you...
          </p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && isError) {
    return (
      <div className={styles.error}>
        <div className={styles.errorIcon}>⚠️</div>
        <div>
          <div className={styles.errorTitle}>Generation Failed</div>
          <div className={styles.errorMessage}>
            {error?.data?.message ||
              error?.message ||
              "Please try again later."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Generate quizzes</h3>
      <p className={styles.subtitle}>
        Choose how many quizzes you want to generate (10-{currentWordCount})
      </p>

      <div className={styles.sliderWrap}>
        <SliderInput
          min={10}
          max={Math.min(25, currentWordCount)}
          value={quizCount}
          onChange={setQuizCount}
        />
      </div>
      {userSubscriptionType === "regular" && (
        <div className={styles.warningFreeUser}>
          <p>
            Your one free quiz attempt per milestone will be used. No further
            quizzes can be generated without <strong>Premium</strong>.
          </p>
        </div>
      )}
      {currentWordCount < targetedWordCount && (
        <div className={styles.warningUser}>
          <p>
            You have not completed this <strong>milestone</strong>. For a better
            quiz experience, we recommend finishing the{" "}
            <strong>milestone</strong>.
          </p>
        </div>
      )}
      <div className={styles.actions}>
        <button className={styles.cancel} onClick={onClose}>
          Cancel
        </button>
        <button
          className={styles.generate}
          onClick={handleQuizDataGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : `Generate ${quizCount} quizzes`}
        </button>
      </div>
    </div>
  );
}

QuizContentGenerator.propTypes = {
  milestoneId: PropTypes.string.isRequired,
  currentWordCount: PropTypes.number.isRequired,
  targetedWordCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerated: PropTypes.func.isRequired,
  userSubscriptionType: PropTypes.string.isRequired,
};
