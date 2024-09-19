import Sparkles from "../../../../components/Sparkles/Sparkles";
import StartBtn from "../../../../components/ui/button/StartBtn/StartBtn";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.gridBackground}>
          <div className={styles.gridOverlay}></div>
        </div>
        <h1 className={styles.title}>Eat Word, Elevate Your Language</h1>
        <div className={styles.ctaBtn}>
          <StartBtn>Start, It&#39;s free</StartBtn>
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
        <div>
          <div>
            <h4>Personalized Learning</h4>
            <p>
              You control your vocabulary. Select words and learn at your own
              pace with personalized support.
            </p>
          </div>
        </div>
        <div>
          <div>
            <h4>Science-Backed Methods</h4>
            <p>
              Enhance retention with proven techniques like Spaced Repetition
              and Active Recall, integrated into your learning journey.
            </p>
          </div>
        </div>
        <div>
          <div>
            <h4>AI-Powered Efficiency</h4>
            <p>
              Our AI helps you quickly fill in word definitions, examples, and
              synonyms to streamline your vocabulary building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
