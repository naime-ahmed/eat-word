import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sparkles from "../../../../components/Sparkles/Sparkles";
import CTABtn from "../../../../components/ui/button/CTABtn/CTABtn";
import Skeleton from "../../../../components/ui/loader/Skeleton/Skeleton";
import styles from "./Hero.module.css";

function Hero() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const handleNavigation = () => {
    if (isAuthenticated) {
      navigate("/my-space");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.gridBackground}>
          <div className={styles.gridOverlay}></div>
        </div>
        <h1 className={styles.title}>Eat Word, Elevate Your Language</h1>
        <div className={styles.ctaBtn}>
          {isLoading ? (
            <Skeleton width="180px" height="45px" />
          ) : (
            <CTABtn handleClick={handleNavigation}>
              {isAuthenticated ? "My Space" : "Start, It's free"}
            </CTABtn>
          )}
        </div>
      </div>
      <div className={styles.sparkleContainer}>
        <div className={styles.gridOverlaySparkles}></div>
        <Sparkles
          density={1200}
          direction="bottom"
          className={styles.sparkles}
        />
      </div>
      <div className={styles.subtitleContainer}>
        <div className={styles.personalizedL}>
          <div>
            <h4>Personalized Learning</h4>
            <p>
              You control your vocabulary, learning at your own pace with
              support.
            </p>
          </div>
        </div>
        <div className={styles.scienceBackedM}>
          <div className={styles.scienceBackedM}>
            <h4>Science-Backed Methods</h4>
            <p>
              Enhance retention using Spaced Repetition and Active Recall
              techniques in learning.
            </p>
          </div>
        </div>
        <div className={styles.aiPowered}>
          <div className={styles.aiPowered}>
            <h4>AI-Powered Efficiency</h4>
            <p>
              Our AI quickly provides definitions, examples, and synonyms for
              vocabulary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
