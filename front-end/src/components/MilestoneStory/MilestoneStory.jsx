import PropTypes from "prop-types";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import styles from "./MilestoneStory.module.css";

// --- Custom Components for Markdown Styling ---
// This object tells react-markdown how to render specific elements.
const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className={styles.storyTitle} {...props} />,
  h2: ({ node, ...props }) => (
    <h2 className={styles.chapterHeading} {...props} />
  ),
  p: ({ node, ...props }) => <p className={styles.chapterText} {...props} />,
  code: ({ node, ...props }) => (
    <code className={styles.highlightedWord} {...props} />
  ),
};

const MilestoneStory = ({ story, regenerate, storyCount }) => {
  const [showFullStory, setShowFullStory] = useState(false);
  const { user } = useSelector((state) => state.user);

  const isLongStory = story.split(" ").length > 150;
  const canRegenerate = user.subscriptionType !== "regular";

  return (
    <div className={styles.storyContainer}>
      <div className={styles.storyHeader}>
        {canRegenerate && (
          <button
            onClick={regenerate}
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

      <div
        className={`${styles.storyContent} ${
          showFullStory ? styles.storyContentFull : ""
        }`}
      >
        <ReactMarkdown components={markdownComponents}>{story}</ReactMarkdown>
      </div>

      {isLongStory && (
        <button
          className={styles.seeMoreBtn}
          onClick={() => setShowFullStory(!showFullStory)}
        >
          <span>{showFullStory ? "Read Less" : "Read More"}</span>
          {showFullStory ? (
            <FaChevronUp className={styles.btnIcon} />
          ) : (
            <FaChevronDown className={styles.btnIcon} />
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
