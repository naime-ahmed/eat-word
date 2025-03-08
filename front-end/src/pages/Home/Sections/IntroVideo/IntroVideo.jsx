import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import img1200 from "../../../../assets/imageForIntroVideo-1200.avif";
import img400 from "../../../../assets/imageForIntroVideo-400.webp";
import img800 from "../../../../assets/imageForIntroVideo-800.webp";
import img from "../../../../assets/imageForIntroVideo.webp";
import Popup from "../../../../components/Popup/Popup";
import styles from "./IntroVideo.module.css";

const IntroVideo = () => {
  const [isPresentVideo, setIsPresentVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleIsPresentVideoOpen = () => {
    setIsPresentVideo(true);
    setVideoLoaded(true);
  };

  const handleIsPresentVideoClose = () => {
    setIsPresentVideo(false);
  };

  useEffect(() => {
    const { hash } = window.location;
    if (hash === "#introvideo") {
      const introVideoElement = document.getElementById("introvideo");
      if (introVideoElement) {
        const targetPosition = introVideoElement.offsetTop - 150;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  }, []);

  return (
    <section id="introvideo" className={styles.introContainer}>
      <div className={styles.introWrapper}>
        <div className={styles.introImage}>
          <img
            src={img}
            srcSet={`${img400} 400w,
          ${img800} 800w,
          ${img1200} 1200w`}
            sizes="(max-width: 400px) 400px,
        (max-width: 800px) 800px,
        1200px"
            alt=""
            role="presentation"
            loading="eager"
            decoding="async"
            width="1200"
            height="675"
          />
          <div className={styles.imageOverlay} aria-hidden="true"></div>
          <div className={styles.playButtonContainer}>
            <button
              className={styles.playButton}
              onClick={handleIsPresentVideoOpen}
              aria-label="Play introduction video"
              type="button"
            >
              <FaPlay className={styles.playIcon} aria-hidden="true" />
            </button>
          </div>
          <Popup
            isOpen={isPresentVideo}
            onClose={handleIsPresentVideoClose}
            popupType="dialog"
          >
            <div className={styles.videoContainer}>
              {videoLoaded && (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/JAyuHIthHco?autoplay=1&modestbranding=1&rel=0&si=nmvZodlxFdoaXzFc`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              )}
            </div>
          </Popup>
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
