import PropsType from "prop-types";
import { useEffect, useState } from "react";
import useNotification from "../../../../hooks/useNotification";
import { useGenerateStoryMutation } from "../../../../services/generativeAi";
import FancyBtn from "../../../ui/button/FancyBtn/FancyBtn";
import ClassicSpinner from "../../../ui/loader/ClassicSpinner/ClassicSpinner";
import styles from "./MilestoneStoryGenerator.module.css";

const STORY_TYPES = [
  "Fantasy",
  "Horror",
  "Literary fiction",
  "Romance novel",
  "Thriller",
  "Science fiction",
  "History",
  "Adventure fiction",
  "Classics",
  "Autobiographies and memoirs",
  "Detective fiction",
  "Mystery",
  "Short stories",
  "Children's literature",
  "Coming-of-age story",
  "Cookbook",
  "Dystopian",
  "Fairy tale",
  "Ghost story",
  "Humor",
  "Satire",
];

const progressMessages = [
  "Gathering your words...",
  "Stirring the plot...",
  "Mixing in the genre spices...",
  "Adding final touches...",
];

const CookingAnimation = () => {
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    const timers = [];
    // Cycle through messages once with 2s interval
    progressMessages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setProgressIndex(index);
      }, index * 3000);
      timers.push(timer);
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <ClassicSpinner />

      <div className={styles.progressMessagesContainer}>
        {progressMessages.map((message, index) => (
          <div
            key={message}
            className={`${styles.progressMessage} ${
              index === progressIndex ? styles.active : ""
            }`}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

const MilestoneStoryGenerator = ({ onClose, milestoneId }) => {
  const [selectedType, setSelectedType] = useState("");
  const [generateStory, { isLoading: isGeneratingStory }] =
    useGenerateStoryMutation();
  const notify = useNotification();

  const handleSelectType = (type) => {
    const newType = type === selectedType ? "" : type;
    setSelectedType(newType);
  };

  const handleGenerateStory = async () => {
    if (selectedType === "") {
      console.log("Did not select any type");
      onClose();
      notify({
        title: "Select one story type",
        message:
          "You have not selected any story type. It's required to get a more personalized story",
        duration: 6000,
      });
      return;
    }
    try {
      const storyData = {
        typeOfStory: selectedType,
        maxStorySize: 1000,
      };
      const res = await generateStory([milestoneId, storyData]);
      console.log("generated story: ", res);
    } catch (error) {
      notify({
        title: "Something went wrong!",
        message:
          error.message ||
          "An error occurred while generating the story for you, try again",
        iconType: "error",
      });
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <div className={styles.storyTypeContainer}>
      {!isGeneratingStory ? (
        <>
          <div className={styles.typeContainer}>
            {STORY_TYPES.map((type) => {
              const isSelected = type === selectedType;
              return (
                <button
                  key={type}
                  className={`${styles.typeButton} ${
                    isSelected ? styles.typeButtonSelected : ""
                  }`}
                  onClick={() => handleSelectType(type)}
                >
                  {isSelected && <span className={styles.cross}>×</span>}
                  <span className={styles.label}>{type}</span>
                </button>
              );
            })}
          </div>
          <FancyBtn clickHandler={handleGenerateStory}>Let&#39;s go</FancyBtn>
        </>
      ) : (
        <CookingAnimation />
      )}
    </div>
  );
};

MilestoneStoryGenerator.propTypes = {
  onClose: PropsType.func,
  milestoneId: PropsType.string,
};

export default MilestoneStoryGenerator;
