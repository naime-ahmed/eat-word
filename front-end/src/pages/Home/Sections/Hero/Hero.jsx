import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CTABtn from "../../../../components/ui/button/CTABtn/CTABtn";
import Skeleton from "../../../../components/ui/loader/Skeleton/Skeleton";
import styles from "./Hero.module.css";

const texts = [
  "Reading",
  "writing",
  "speaking",
  "Thinking",
  "Confidence",
  "Knowledge",
  "Growth",
  "Success",
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState(null);
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (isAuthenticated) {
      navigate("/my-space");
    } else {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        setLeavingIndex(prev);
        setTimeout(() => {
          setLeavingIndex(null);
        }, 700);
        return (prev + 1) % texts.length;
      });
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.staticText}>Eat Word—Elevate</span>
          <span>Your</span>
          <span className={styles.animatedContainer}>
            {leavingIndex !== null && (
              <span
                className={`${styles.animatedText} ${styles.exit}`}
                key={`exit-${leavingIndex}`}
              >
                {texts[leavingIndex]}
              </span>
            )}
            <span
              className={`${styles.animatedText} ${styles.enter}`}
              key={`enter-${currentIndex}`}
            >
              {texts[currentIndex]}
            </span>
          </span>
        </div>
        <p className={styles.HeroDescription}>
          We help you digest the words you crave—with active recall, spaced
          repetition, contextual learning, and AI, vocabulary becomes second
          nature.
        </p>
        <div className={styles.ctaBtn}>
          {isLoading ? (
            <Skeleton width="180px" height="45px" />
          ) : (
            <CTABtn handleClick={handleNavigation}>
              {isAuthenticated ? "My Space" : "Get started - free"}
            </CTABtn>
          )}
        </div>
      </div>
      <div className={styles.curvedMask}></div>
    </div>
  );
}

export default Hero;
