import img1 from "../../assets/eatWordForAbout.webp";
import planImg from "../../assets/imageForAboutUsFPlan.webp";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import styles from "./About.module.css";

const About = () => {
  // manage the scroll position
  useScrollRestoration();

  return (
    <div className={styles.aboutUsPage}>
      <Header />
      <main className={styles.aboutUsContainer}>
        <div>
          <div>
            <h1>What Is &quot;Eat Word&quot;?</h1>
            <p>
              &quot;Eat Word&quot; is a unique vocabulary learning platform.
              Unlike traditional apps with pre-installed word lists, here, you
              choose the words you want to learn. Our system uses proven methods
              like Spaced Repetition, Active Recall, and Contextual Learning to
              ensure long-term retention. AI integration helps streamline the
              process by suggesting definitions, synonyms, and example
              sentences, making learning fast and efficient. It&apos;s a
              personalized, science-backed approach to mastering vocabulary on
              your terms.
            </p>
          </div>
          <div className={styles.aboutEWImg}>
            <img src={img1} alt="Eat Word Platform Overview" loading="lazy" />
          </div>
        </div>
        <div>
          <div className={styles.aboutMotiveMark}>
            <p>?</p>
          </div>
          <div>
            <h1>Why I Created This Platform?</h1>
            <p>
              Yes, it&apos;s built by a single person. I built &quot;Eat
              Word&quot; for myself, as I wanted a tool that lets me take
              control of my own learning journey. Traditional apps didn&apos;t
              fit my needs, so I designed this platform to focus on the words I
              find important. Now, I&apos;m making it public for others who,
              like me, want a flexible, personalized approach to learning
              vocabulary and improving their English proficiency.
            </p>
          </div>
        </div>
        <div>
          <div>
            <h1>Future Plans</h1>
            <p>
              We plan to enhance AI-driven word suggestions and add
              progress-tracking features. Interactive tools like quizzes and
              word games will make learning more engaging. In the future, we
              also aim to foster a community where users can share words and
              learn from each other, ensuring &quot;Eat Word&quot; becomes a
              dynamic, evolving tool for learners.
            </p>
          </div>
          <div className={styles.aboutFutureImg}>
            <img src={planImg} alt="Future Plans for Eat Word" loading="lazy" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
