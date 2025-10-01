import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import PrimaryBtn from "../../ui/button/PrimaryBtn/PrimaryBtn";
import CustomSelect from "../../ui/input/CustomSelect/CustomSelect";
import QuestionTimer from "../QuestionTimer/QuestionTimer";
import styles from "./QuizPlayer.module.css";
function ProgressBar({ current, total }) {
  const percentage = Math.round((current / Math.max(total, 1)) * 100);
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressText}>
          Question {current} of {total}
        </span>
        <span className={styles.progressPercentage}>{percentage}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

function QuestionCard({
  children,
  quizType,
  difficulty,
  focus,
  wordsTested,
  quizMode,
  timeBoundInSec,
  marks,
  onTimeUp,
  showAnswer,
  answer,
}) {
  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <div className={styles.badges}>
          <span
            className={`${styles.difficultyBadge} ${
              styles[difficulty.toLowerCase()]
            }`}
          >
            {difficulty}
          </span>
          {focus && (
            <span className={styles.focusBadge}>
              {focus.split("_").join(" ")}
            </span>
          )}
        </div>
        <div className={styles.marks}>Points: {marks}</div>
      </div>

      <div className={styles.questionContent}>{children}</div>
      <div className={styles.questionFooter}>
        {showAnswer ? (
          <div className={styles.answerContainer}>
            <div className={styles.explanation}>{answer.explanation}</div>
            {quizType === "matching" && (
              <div className={styles.answer}>{answer.text}</div>
            )}
          </div>
        ) : (
          <>
            {wordsTested && wordsTested.length > 0 && (
              <div className={styles.wordsContainer}>
                <span className={styles.wordsLabel}>Testing:</span>
                <div className={styles.wordsList}>
                  {wordsTested.map((word) => (
                    <span key={word} className={styles.wordChip}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {timeBoundInSec !== undefined && quizMode === "timed" && (
              <QuestionTimer
                timeBoundInSec={timeBoundInSec}
                onTimeUp={onTimeUp}
                variant="circular"
                width={55}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  children: PropTypes.node.isRequired,
  quizType: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  focus: PropTypes.string,
  wordsTested: PropTypes.arrayOf(PropTypes.string),
  quizMode: PropTypes.string.isRequired,
  timeBoundInSec: PropTypes.number,
  marks: PropTypes.number,
  onTimeUp: PropTypes.func,
  showAnswer: PropTypes.bool,
  answer: PropTypes.object,
};

function MCQ({ item, value, setValue, showAnswer }) {
  return (
    <>
      <div className={styles.questionInstruction}>{item.instruction}</div>
      <h2 className={styles.questionTitle}>{item.question}</h2>
      <div className={styles.optionsGrid}>
        {item.options.map((option, index) => {
          const isSelected = value === option.id;
          const isCorrect = option.isCorrect;
          let buttonClass = styles.optionButton;
          if (showAnswer) {
            if (isCorrect) {
              buttonClass += ` ${styles.correct}`;
            } else if (isSelected && !isCorrect) {
              buttonClass += ` ${styles.incorrect}`;
            }
          } else if (isSelected) {
            buttonClass += ` ${styles.selected}`;
          }

          return (
            <button
              key={option.id}
              className={buttonClass}
              onClick={() => !showAnswer && setValue(option.id)}
              disabled={showAnswer}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionText}>{option.text}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
MCQ.propTypes = {
  item: PropTypes.shape({
    instruction: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        isCorrect: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  showAnswer: PropTypes.bool,
  result: PropTypes.object,
};

function TrueFalse({ item, value, setValue, showAnswer }) {
  const getButtonClass = (isTrueButton) => {
    const correctOption = item.options.find((opt) => opt.isCorrect);
    const isCorrect = correctOption.text.toLowerCase() === "true";
    let buttonClass = `${styles.trueFalseButton} ${
      isTrueButton ? styles.trueButton : styles.falseButton
    }`;

    if (showAnswer) {
      if ((isTrueButton && isCorrect) || (!isTrueButton && !isCorrect)) {
        buttonClass += ` ${styles.correct}`;
      } else if (
        (isTrueButton && value === "true" && !isCorrect) ||
        (!isTrueButton && value === "false" && isCorrect)
      ) {
        buttonClass += ` ${styles.incorrect}`;
      }
    } else if (
      (isTrueButton && value === "true") ||
      (!isTrueButton && value === "false")
    ) {
      buttonClass += ` ${styles.selected}`;
    }
    return buttonClass;
  };
  return (
    <>
      <div className={styles.questionInstruction}>{item.instruction}</div>
      <h2 className={styles.questionTitle}>{item.question}</h2>
      <div className={styles.trueFalseContainer}>
        <button
          className={getButtonClass(true)}
          onClick={() => !showAnswer && setValue("true")}
          disabled={showAnswer}
        >
          <div className={styles.trueFalseIcon}>✓</div>
          <span>True</span>
        </button>
        <button
          className={getButtonClass(false)}
          onClick={() => !showAnswer && setValue("false")}
          disabled={showAnswer}
        >
          <div className={styles.trueFalseIcon}>✗</div>
          <span>False</span>
        </button>
      </div>
    </>
  );
}
TrueFalse.propTypes = {
  item: PropTypes.shape({
    instruction: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
  }).isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  showAnswer: PropTypes.bool,
};

function Matching({ item, value, setValue, showAnswer }) {
  const [selectWidth, setSelectWidth] = useState("200px");

  const correctPairs = item.answer.text
    .split(",")
    .map((pair) =>
      pair
        .trim()
        .split(/→|->/)
        .map((s) => s.trim())
    )
    .reduce((acc, [word, match]) => {
      acc[word.toLowerCase()] = match;
      return acc;
    }, {});

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setSelectWidth(window.innerWidth < 768 ? "150px" : "200px");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={styles.questionInstruction}>{item.instruction}</div>
      <h2 className={styles.questionTitle}>{item.question}</h2>
      <div className={styles.matchingContainer}>
        {item.wordsTested.map((word) => {
          const userMatch = value?.[word];
          const correctMatch = correctPairs[word.toLowerCase()];
          const isCorrect = userMatch === correctMatch;

          let rowClass = styles.matchingRow;
          if (showAnswer && !isCorrect) {
            rowClass += ` ${styles.incorrect}`;
          }

          return (
            <div key={word} className={styles.matchingColumn}>
              <div className={rowClass}>
                <div className={styles.matchingWord}>{word}</div>
                <div className={styles.matchingArrow}>
                  <GoArrowRight />
                </div>
                <CustomSelect
                  value={userMatch || ""}
                  onChange={(selectedValue) =>
                    setValue({
                      ...(value || {}),
                      [word]: selectedValue,
                    })
                  }
                  options={item.options.filter(
                    (option) => option.text.toLowerCase() !== word.toLowerCase()
                  )}
                  placeholder="Choose match..."
                  customStyles={{ width: selectWidth }}
                  disabled={showAnswer}
                />
              </div>
              {showAnswer && !isCorrect && (
                <div className={styles.matchingAnswer}>
                  Correct: {correctMatch}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

Matching.propTypes = {
  item: PropTypes.shape({
    instruction: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    wordsTested: PropTypes.arrayOf(PropTypes.string).isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
      })
    ),
    answer: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  value: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  showAnswer: PropTypes.bool,
};

function NavigationControls({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  onClose,
  hasAnswer,
  quizMode,
  showAnswer,
}) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  if (showAnswer && isLastQuestion) {
    return (
      <div className={styles.navigationContainer}>
        <button className={styles.prevButton} onClick={onPrevious}>
          <IoArrowBack /> Previous
        </button>
        <button className={styles.nextButton} onClick={onClose}>
          Finish Review
        </button>
      </div>
    );
  }

  return (
    <div className={styles.navigationContainer}>
      <button
        className={styles.prevButton}
        onClick={onPrevious}
        disabled={isFirstQuestion || (quizMode === "timed" && !showAnswer)}
      >
        <IoArrowBack /> <span>Previous</span>
      </button>

      <div className={styles.navigationDots}>
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`${styles.navDot} ${
              i === currentIndex ? styles.active : ""
            } ${i < currentIndex ? styles.completed : ""}`}
          />
        ))}
      </div>

      {isLastQuestion && !showAnswer ? (
        <button
          className={`${styles.submitButton} ${
            !hasAnswer ? styles.disabled : ""
          }`}
          onClick={onSubmit}
          disabled={!hasAnswer}
        >
          Submit Quiz
        </button>
      ) : (
        <button className={styles.nextButton} onClick={onNext}>
          <span>Next</span> <IoArrowForward />
        </button>
      )}
    </div>
  );
}

NavigationControls.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hasAnswer: PropTypes.func,
  quizMode: PropTypes.string.isRequired,
  showAnswer: PropTypes.bool,
};

function ResultsScreen({ scoreObj, onRetake, quizMode, handlerShowAnser }) {
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return styles.excellentScore;
    if (percentage >= 60) return styles.goodScore;
    return styles.needsImprovementScore;
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    return "Keep practicing! 💪";
  };

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>Quiz Complete!</h2>
          <p className={styles.resultsSubtitle}>
            {getScoreMessage(scoreObj.percent)}
          </p>
        </div>

        <div
          className={`${styles.scoreDisplay} ${getScoreColor(
            scoreObj.percent
          )}`}
        >
          <div className={styles.scorePercentage}>{scoreObj.percent}%</div>
          <div className={styles.scoreDetails}>
            <span>
              {scoreObj.correct} out of {scoreObj.total} correct
            </span>
          </div>
        </div>

        <div className={styles.resultsActions}>
          {quizMode === "timed" ? (
            <PrimaryBtn btnType="button" handleClick={handlerShowAnser}>
              Show Answer
            </PrimaryBtn>
          ) : (
            <PrimaryBtn handleClick={onRetake} btnType="button">
              Retake Quiz
            </PrimaryBtn>
          )}
        </div>
      </div>
    </div>
  );
}

ResultsScreen.propTypes = {
  scoreObj: PropTypes.shape({
    total: PropTypes.number.isRequired,
    correct: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
    detailed: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        correct: PropTypes.bool.isRequired,
        answer: PropTypes.string,
        userAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      })
    ).isRequired,
  }).isRequired,
  onRetake: PropTypes.func.isRequired,
  quizMode: PropTypes.string.isRequired,
  handlerShowAnser: PropTypes.func.isRequired,
};

export default function QuizPlayer({ quiz, quizMode, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [scoreResults, setScoreResults] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const detailedAnswer = scoreResults?.detailed.find(
    (d) => d.id === currentQuestion?.id
  );
  const setCurrentAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const hasCurrentAnswer = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.quizType === "matching") {
      return (
        answer &&
        typeof answer === "object" &&
        Object.keys(answer).length === currentQuestion.wordsTested.length
      );
    }
    return answer !== undefined && answer !== null && answer !== "";
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    const detailedResults = questions.map((question) => {
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (question.quizType === "multiple_choice") {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        isCorrect = correctOption && userAnswer === correctOption.id;
      } else if (question.quizType === "true_false") {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (correctOption) {
          isCorrect =
            (userAnswer === "true" &&
              correctOption.text.toLowerCase() === "true") ||
            (userAnswer === "false" &&
              correctOption.text.toLowerCase() === "false");
        }
      } else if (question.quizType === "matching") {
        isCorrect = true;
        if (userAnswer && typeof userAnswer === "object") {
          const correctPairs = question.answer.text.split(",").map((pair) =>
            pair
              .trim()
              .split(/→|->/)
              .map((s) => s.trim())
          );
          for (const [word, match] of Object.entries(userAnswer)) {
            const correctPair = correctPairs.find(
              (pair) => pair[0].toLowerCase() === word.toLowerCase()
            );
            if (!correctPair || correctPair[1] !== match) {
              isCorrect = false;
              break;
            }
          }
        } else {
          isCorrect = false;
        }
      }
      if (isCorrect) correctAnswers++;
      return {
        id: question.id,
        correct: isCorrect,
        answer: question.answer?.text ?? null,
        userAnswer,
      };
    });

    const percentage = Math.round(
      (correctAnswers / Math.max(totalQuestions, 1)) * 100
    );
    const results = {
      total: totalQuestions,
      correct: correctAnswers,
      percent: percentage,
      detailed: detailedResults,
    };

    setScoreResults(results);
    setShowResults(true);
  };

  const handleRetake = () => {
    setShowResults(false);
    setCurrentIndex(0);
    setAnswers({});
    setScoreResults(null);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handlerShowAnser = () => {
    setCurrentIndex(0);
    setShowResults(false);
    setShowAnswer(true);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <h3 className={styles.emptyTitle}>No Questions Available</h3>
        <p className={styles.emptyMessage}>
          Generate quiz questions first to start practicing.
        </p>
      </div>
    );
  }

  if (showResults && scoreResults) {
    return (
      <ResultsScreen
        scoreObj={scoreResults}
        onRetake={handleRetake}
        quizMode={quizMode}
        handlerShowAnser={handlerShowAnser}
      />
    );
  }

  return (
    <div className={styles.quizPlayer}>
      <div className={styles.quizContainer}>
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        <QuestionCard
          key={currentQuestion.id}
          quizType={currentQuestion.quizType}
          difficulty={currentQuestion.difficulty}
          focus={currentQuestion.metadata?.questionFocus}
          wordsTested={currentQuestion.wordsTested}
          quizMode={quizMode}
          timeBoundInSec={currentQuestion?.metadata?.estimatedTimeSec}
          marks={currentQuestion?.marks}
          onTimeUp={() => {
            if (currentQuestion.id === questions[questions.length - 1].id) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}
          showAnswer={showAnswer}
          answer={currentQuestion.answer}
        >
          {currentQuestion.quizType === "multiple_choice" && (
            <MCQ
              item={currentQuestion}
              value={answers[currentQuestion.id]}
              setValue={setCurrentAnswer}
              showAnswer={showAnswer}
              result={detailedAnswer}
            />
          )}
          {currentQuestion.quizType === "true_false" && (
            <TrueFalse
              item={currentQuestion}
              value={answers[currentQuestion.id]}
              setValue={setCurrentAnswer}
              showAnswer={showAnswer}
            />
          )}
          {currentQuestion.quizType === "matching" && (
            <Matching
              item={currentQuestion}
              value={answers[currentQuestion.id]}
              setValue={setCurrentAnswer}
              showAnswer={showAnswer}
            />
          )}
        </QuestionCard>

        <NavigationControls
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          onClose={onClose}
          hasAnswer={hasCurrentAnswer}
          quizMode={quizMode}
          showAnswer={showAnswer}
        />
      </div>
    </div>
  );
}

QuizPlayer.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    correctCount: PropTypes.number.isRequired,
    incorrectCount: PropTypes.number.isRequired,
    questions: PropTypes.array,
    score: PropTypes.any,
    timeTakeSec: PropTypes.number,
    milestoneId: PropTypes.string,
    userId: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    __v: PropTypes.number,
  }).isRequired,
  quizMode: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
