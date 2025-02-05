import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import img from "../../../../assets/imageForIntroVideo.png";
import placeholderVideo from "../../../../assets/tmpVideoForTutorial.mp4";
import Popup from "../../../../components/Popup/Popup";
import styles from "./IntroVideo.module.css";

const IntroVideo = () => {
  const [isPresentVideo, setIsPresentVideo] = useState(false);

  const handleIsPresentVideoOpen = () => {
    setIsPresentVideo(true);
  };
  const handleIsPresentVideoClose = () => {
    setIsPresentVideo(false);
  };

  return (
    <div className={styles.introContainer}>
      <div className={styles.introWrapper}>
        <div className={styles.introImage}>
          <img src={img} alt="Introduction video thumbnail" />
          <div className={styles.imageOverlay}></div>
          <div className={styles.playButtonContainer}>
            <button
              className={styles.playButton}
              onClick={handleIsPresentVideoOpen}
            >
              <FaPlay className={styles.playIcon} />
            </button>
          </div>
          <Popup
            isOpen={isPresentVideo}
            onClose={handleIsPresentVideoClose}
            popupType="dialog"
          >
            <div className={styles.videoContainer}>
              <video src={placeholderVideo} autoPlay controls>
                Your browser does not support the video tag.
                <source src="movie.mp4" type="video/mp4" />
              </video>
            </div>
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default IntroVideo;
