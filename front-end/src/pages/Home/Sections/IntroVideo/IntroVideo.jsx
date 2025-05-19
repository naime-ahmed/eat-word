import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import imgAVIF from "../../../../assets/imageForIntroVideo-1200.avif";
import img400 from "../../../../assets/imageForIntroVideo-400.webp";
import img800 from "../../../../assets/imageForIntroVideo-800.webp";
import img1200 from "../../../../assets/imageForIntroVideo.webp";
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
    if (window.location.hash === "#introvideo") {
      const el = document.getElementById("introvideo");
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 150,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const offset = 100;
      const start = windowHeight;
      const end = offset;

      const distance = rect.top - end;

      // Clamp progress from 0 to 1
      const progress = Math.min(
        Math.max((start - distance) / (start - end), 0),
        1
      );

      const maxRotation = 20;
      const rotation = maxRotation * (1 - progress);

      wrapper.style.transform = `perspective(1000px) rotateX(${rotation}deg)`;
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="introvideo" className={styles.introContainer}>
      <div className={styles.introWrapper} ref={wrapperRef}>
        <div className={styles.introImage}>
          <picture>
            <source
              media="(max-width: 400px)"
              srcSet={img400}
              type="image/webp"
            />
            <source
              media="(max-width: 800px)"
              srcSet={img800}
              type="image/webp"
            />
            <source srcSet={imgAVIF} type="image/avif" />
            <img
              src={img1200}
              alt=""
              role="presentation"
              loading="eager"
              decoding="async"
              width="1200"
              height="675"
            />
          </picture>

          <div className={styles.imageOverlay} aria-hidden="true" />
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
                  src="https://www.youtube-nocookie.com/embed/JAyuHIthHco?autoplay=1&modestbranding=1&rel=0"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  style={{ width: "100%", height: "100%", border: 0 }}
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
