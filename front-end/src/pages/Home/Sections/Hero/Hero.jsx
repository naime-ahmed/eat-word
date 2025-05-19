import { useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CTABtn from "../../../../components/ui/button/CTABtn/CTABtn";
import Skeleton from "../../../../components/ui/loader/Skeleton/Skeleton";
import { countryLanguageMapping, getLanguageForVisitor } from "../../utils.js";
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
  const [localLanguages, setLocalLanguages] = useState({
    motherTongue: "",
    motherFlag: "",
    secondLanguage: "",
    secondFlag: "",
  });
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

  // set languages based on visitors origin
  useEffect(() => {
    const setVisitorLanguage = async () => {
      try {
        const countryCode = await getLanguageForVisitor("BD");
        const mapping =
          countryLanguageMapping[countryCode] || countryLanguageMapping.BD;
        setLocalLanguages(mapping);
      } catch (error) {
        console.error("Language detection failed:", error);
        setLocalLanguages(countryLanguageMapping.BD);
      }
    };

    setVisitorLanguage();
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

      <div className={styles.langContainer}>
        {/* First Language Container */}
        <div className={styles.countryLang}>
          <img
            src={`https://flagcdn.com/h60/${localLanguages.motherFlag}.webp`}
            alt={`${localLanguages.motherTongue} flag`}
            className={styles.flag}
          />
          <span>{localLanguages.motherTongue}</span>
        </div>

        {/* Second Language Container */}
        <div className={styles.countryLangSecond}>
          <img
            src={`https://flagcdn.com/h60/${localLanguages.secondFlag}.webp`}
            alt={`${localLanguages.secondLanguage} flag`}
            className={styles.flag}
          />
          <span>{localLanguages.secondLanguage}</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
