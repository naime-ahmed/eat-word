import { useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CTABtn from "../../../../components/ui/button/CTABtn/CTABtn";
import Skeleton from "../../../../components/ui/loader/Skeleton/Skeleton";
import CurlyArrow from "../../../../components/ui/svg/Arrow/CurlyArrow";
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

  const handleNavigateToHotNews = () => {
    navigate("/release");
  };

  return (
    <section className={styles.container}>
      <div className={styles.heroContent}>
        <div className={styles.shinyText}>
          <div onClick={handleNavigateToHotNews} className={styles.shinyTextBg}>
            <span className={styles.shinyAnimatedText}>
              <span>✨ Generate with AI is here</span>
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
          We help you digest the words you crave—with active recall, spaced
          repetition, contextual learning, and AI, vocabulary becomes second
          nature.
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
          <div className={styles.messageAndArrow}>
            <div className={styles.motherLangArrow}>
              <CurlyArrow rotation={180} fill="#f0f4ff" stroke="#f0f4ff" />
            </div>
            <div className={styles.motherMessage}>You know?</div>
          </div>
        </div>

        {/* Second Language Container */}
        <div className={styles.countryLangSecond}>
          <img
            src={`https://flagcdn.com/h60/${localLanguages.secondFlag}.webp`}
            alt={`${localLanguages.secondLanguage} flag`}
            className={styles.flag}
          />
          <span>{localLanguages.secondLanguage}</span>
          <div className={styles.messageAndArrow}>
            <div className={styles.secondLangArrow}>
              <CurlyArrow rotation={270} fill="#f0f4ff" stroke="#f0f4ff" />
            </div>
            <div className={styles.secondMessage}>Learn</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
