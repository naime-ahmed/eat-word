import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import quizIcon from "../../assets/quizIcon.png";
import { useBringQuizzesQuery } from "../../services/milestone";
import Popup from "../Popup/Popup";
import ChooseMood from "./ChooseMood/ChooseMood";
import styles from "./Quiz.module.css";
import QuizContentGenerator from "./QuizContentGenerator/QuizContentGenerator";
import QuizPlayer from "./QuizPlayer/QuizPlayer";

const Quiz = ({ milestoneID, currentWordCount }) => {
  const [isShowingQuiz, setIsShowingQuiz] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizMode, setQuizMode] = useState(""); // timed or practice
  const { user } = useSelector((state) => state.user);

  const { data, isLoading, isError, error } = useBringQuizzesQuery(milestoneID);

  useEffect(() => {
    setQuizzes(data?.quizzes || []);
  }, [data]);

  const handleOpenQuiz = () => {
    setIsShowingQuiz(true);
  };
  const handleCloseQuiz = () => {
    setIsShowingQuiz(false);
    setQuizMode("");
  };

  const onGenerated = (data) => {
    setQuizzes([...quizzes, data.quiz]);
  };
  // console.log("error", isError, error);
  console.log("quizzes", quizzes);
  return (
    <div className={styles.quiz} onClick={handleOpenQuiz}>
      <img src={quizIcon} alt="milestone quiz icon" />
      <small>Quiz</small>
      <Popup
        isOpen={isShowingQuiz}
        onClose={handleCloseQuiz}
        closeOnOutsideClick={false}
      >
        {isLoading ? (
          <div className={styles.loading}>Quizzes are loading...</div>
        ) : isError ? (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <div>
              <div className={styles.errorTitle}>Something went wrong</div>
              <div className={styles.errorMessage}>
                {error?.data?.message ||
                  error?.message ||
                  "Please try again later."}
              </div>
            </div>
          </div>
        ) : currentWordCount < 15 ? (
          <InsufficientWords currentWordCount={currentWordCount} />
        ) : quizzes.length === 0 ? (
          <QuizContentGenerator
            milestoneId={milestoneID}
            currentWordCount={currentWordCount}
            onClose={handleCloseQuiz}
            onGenerated={onGenerated}
            userSubscriptionType={user.subscriptionType}
          />
        ) : quizMode === "" ? (
          <ChooseMood setQuizMode={setQuizMode} />
        ) : (
          <QuizPlayer
            quiz={quizzes[0]}
            quizMode={quizMode}
            onClose={handleCloseQuiz}
          />
        )}
      </Popup>
    </div>
  );
};

Quiz.propTypes = {
  milestoneID: PropTypes.string.isRequired,
  currentWordCount: PropTypes.number.isRequired,
};

export default Quiz;

const InsufficientWords = ({ currentWordCount }) => {
  return (
    <div className={styles.insufficientWords}>
      <div className={styles.contentWrapper}>
        <div className={styles.icon}>📝</div>
        <h3>More words needed for your quiz</h3>
        <p>
          Your current milestone has{" "}
          <span className={styles.wordCount}>{currentWordCount}</span> words,
          but we need at least <span className={styles.reqWordCount}>15</span>{" "}
          words to create quizzes.
        </p>
        <div className={styles.suggestion}>
          <p>
            💡 <strong>Tip:</strong> Complete the milestone to get a meaningful
            quiz experience!
          </p>
        </div>
      </div>
    </div>
  );
};

InsufficientWords.propTypes = {
  currentWordCount: PropTypes.number.isRequired,
};
