import { useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AvatarReview from "../../../../components/AvatarReview/AvatarReview";
import CTABtn from "../../../../components/ui/button/CTABtn/CTABtn";
import Skeleton from "../../../../components/ui/loader/Skeleton/Skeleton";
import { trustedUserAvatar } from "../../utils";
import styles from "./Hero.module.css";

const texts = [
  "Reading",
  "Writing",
  "Speaking",
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
  const capsuleCTA = {
    route: isLoading ? "/" : isAuthenticated ? "/release" : "/sign-up",
    content: isLoading
      ? "wait, it's loading..."
      : isAuthenticated
      ? "✨ You can now see the limits"
      : "✨ Free 1-month Pro for you",
  };

  // Cycle through animated texts
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

  const handleNavigation = () => {
    if (isAuthenticated) {
      navigate("/my-space");
    } else {
      navigate("/sign-in");
    }
  };

  const handleCapsuleCTANavigate = () => {
    navigate(capsuleCTA.route);
  };

  return (
    <section className={styles.container}>
      <div className={styles.heroContent}>
        <div className={styles.shinyText}>
          <div
            onClick={handleCapsuleCTANavigate}
            className={styles.shinyTextBg}
          >
            <span className={styles.shinyAnimatedText}>
              <span>{capsuleCTA.content}</span>
              <IoArrowForward className={styles.arrowIcon} />
            </span>
          </div>
        </div>
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
          Master vocabulary with active recall, spaced repetition, context,{" "}
          <br className={styles.breakLine} /> and AI, so it sticks for life.
        </p>
        {isLoading ? (
          <Skeleton width="180px" height="63px" />
        ) : (
          <CTABtn
            handleClick={handleNavigation}
            aria-label={
              isAuthenticated ? "Go to My Space" : "Get Started - Free"
            }
          >
            {isAuthenticated ? "My Space" : "Get started - free"}
          </CTABtn>
        )}
      </div>
      <div className={`${styles.curvedMask} ${styles.animated}`}></div>
      <div className={styles.trustedUser}>
        <AvatarReview
          avatars={trustedUserAvatar}
          trustedUsersCount={150}
          maxDisplayedAvatars={5}
        />
      </div>
    </section>
  );
}

export default Hero;
