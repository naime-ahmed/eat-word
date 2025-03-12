import PropsTypes from "prop-types";
import { useState } from "react";
import styles from "./MilestoneStory.module.css";

const MilestoneStory = ({ story }) => {
  const chapters = story.split("\n\n");
  const [showFullStory, setShowFullStory] = useState(false);

  const handleSeeMoreLess = () => setShowFullStory((prev) => !prev);

  const parseBold = (text) => {
    const regex = /\*(.*?)\*/g;
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
          <div key={index} className={styles.chapter}>
            {heading && (
              <h2 className={styles.chapterHeading}>{parseBold(heading)}</h2>
            )}
            <p className={styles.chapterText}>{parseBold(content)}</p>
          </div>
        );
      })}
      {chapters.length > 1 && (
        <button className={styles.seeMoreBtn} onClick={handleSeeMoreLess}>
          {!showFullStory ? "Read More" : "Read Less"}
        </button>
      )}
    </div>
  );
};

MilestoneStory.propTypes = {
  story: PropsTypes.string,
};
export default MilestoneStory;
