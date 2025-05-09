import PropTypes from "prop-types";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import styles from "./MilestoneStory.module.css";

const MilestoneStory = ({ story, regenerate, storyCount }) => {
  const chapters = story.split("\n\n");
  const [showFullStory, setShowFullStory] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleSeeMoreLess = () => setShowFullStory((prev) => !prev);

  const parseBold = (text) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className={styles.storyContainer}>
      <div className={styles.storyHeading}>
        <h1>Here is your story, a gift from Eat Word</h1>
        {!user.subscriptionType === "regular" && (
          <button
            onClick={() => regenerate()}
            className={styles.regenerateStory}
            title="Regenerate story"
            disabled={storyCount === 0}
          >
            <IoReloadSharp />
            <span
              className={styles.tooltip}
            >{`Regenerate story. ${storyCount} times left`}</span>
          </button>
        )}
      </div>
      <div className={styles.storyContent}>
        {chapters.map((chapter, index) => {
          if (!showFullStory && index >= 2) return null;

          // Split chapter into lines
          const lines = chapter.split("\n").filter(Boolean);
          let heading = "";
          let content = chapter;

          if (lines[0] && lines[0].startsWith("Chapter")) {
            heading = lines[0];
            content = lines.slice(1).join("\n");
          }

          if (!showFullStory && index === 1) {
            const words = content.split(" ");
            const halfLength = Math.ceil(words.length / 2);
            content = words.slice(0, halfLength).join(" ") + " ...";
          }

          return (
            <div key={index} className={styles.chapterContainer}>
              <div className={styles.chapter}>
                {heading && (
                  <h2 className={styles.chapterHeading}>
                    {parseBold(heading)}
                  </h2>
                )}
                <p className={styles.chapterText}>{parseBold(content)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {chapters.length > 1 && (
        <button className={styles.seeMoreBtn} onClick={handleSeeMoreLess}>
          <span>{!showFullStory ? "Read More" : "Read Less"}</span>
          {!showFullStory ? (
            <FaChevronDown className={styles.btnIcon} />
          ) : (
            <FaChevronUp className={styles.btnIcon} />
          )}
        </button>
      )}
    </div>
  );
};

MilestoneStory.propTypes = {
  story: PropTypes.string,
  regenerate: PropTypes.func,
  storyCount: PropTypes.number,
};

export default MilestoneStory;
