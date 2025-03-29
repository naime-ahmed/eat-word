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
        <div className={styles.whatIsEatWord}>
          <h1>What is Eat Word?</h1>
          <div>
            <p>
              Eat Word is an AI-powered vocabulary platform designed to help you
              master the words that truly matter to your life—not random,
              forgettable terms. Unlike traditional apps cluttered with generic
              lists, Eat Word starts as a blank canvas. You choose words from
              your world: a technical term in a work document, a phrase from a
              novel you&#39;re reading, slang in a podcast, or even a concept
              you struggled to explain in yesterday&#39;s meeting.
            </p>
          </div>
          <div className={styles.whatIsEatWordPoints}>
            <div>
              <h3>Your Words, Your Rules</h3>
              <p>
                Add any word or phrase you encounter—no preloaded lists. The app
                adapts to your goals, whether you&#39;re prepping for exams,
                refining workplace communication, or exploring a new language.
              </p>
            </div>
            <div>
              <h3>AI Generates Everything You Need</h3>
              <p>
                Eat Word&#39;s AI instantly creates easy-to-digest learning
                materials:
              </p>
              <ul>
                <li>Simple, memorable definitions (no dictionary jargon)</li>
                <li>
                  Real-life example sentences from your interests (e.g.,
                  “algorithm” explained using your coding hobby)
                </li>
                <li>Pronunciations, synonyms, and common mistakes</li>
              </ul>
            </div>
            <div>
              <h3>Science-Backed Learning That Actually Works</h3>
              <p>
                The app blends three proven techniques to make words stick
                permanently:
              </p>
              <ul>
                <li>
                  Active Recall: Quick, game-like quizzes tailored to your
                  progress.
                </li>
                <li>
                  Spaced Repetition: Reviews timed to your brain&#39;s
                  “forgetting curve.”
                </li>
                <li>
                  Contextual Immersion: Learn words through examples from your
                  life (emails, shows, hobbies).
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.whyEatWordDiffer}>
            <h2>Why It&#39;s Different?</h2>
            <p>
              Other apps teach “obscure” words you&#39;ll never use. Eat Word
              focuses on your gaps. Forgot a word during a presentation? Need to
              sound more professional in emails? Studying for the TOEFL? The AI
              prioritizes what you need to learn, not a one-size-fits-all
              curriculum.
            </p>
            <p>
              Whether you&#39;re a student, professional, or language
              enthusiast, Eat Word grows with you. It&#39;s not just an
              app—it&#39;s your always-available vocabulary coach, turning
              real-life moments into lifelong mastery.
            </p>
          </div>
        </div>
        {/* Why Eat Word Section */}
        <div className={styles.whyEatWord}>
          <div className={styles.creationJourney}>
            <div className={styles.timeline}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineLine}></div>
            </div>

            <div className={styles.journeyContent}>
              <h1>Why I Built Eat Word</h1>

              <div className={styles.storyCard}>
                <div className={styles.storySection}>
                  <h3>The Struggle</h3>
                  <p>
                    🌍 My journey began as a non-native speaker wanting to
                    connect globally. Despite understanding English, I
                    constantly faced:
                  </p>
                  <ul>
                    <li>
                      📚 Textbook knowledge that did not translate to real
                      conversations
                    </li>
                    <li>😓 Awkward pauses searching for the right words</li>
                    <li>
                      🔄 Forgetting terms I&#39;d &#34;learned&#34; multiple
                      times
                    </li>
                  </ul>
                </div>

                <div className={styles.storySection}>
                  <h3>The Discovery</h3>
                  <p>
                    🔬 Through research, I found three science-backed solutions:
                  </p>
                  <div className={styles.methodCards}>
                    <div className={styles.methodCard}>
                      <h4>Active Recall</h4>
                      <p>Testing myself instead of passive reading</p>
                    </div>
                    <div className={styles.methodCard}>
                      <h4>Spaced Repetition</h4>
                      <p>Strategic review timing</p>
                    </div>
                    <div className={styles.methodCard}>
                      <h4>Contextual Learning</h4>
                      <p>Real-world usage examples</p>
                    </div>
                  </div>
                </div>

                <div className={styles.storySection}>
                  <h3>The Evolution</h3>
                  <div className={styles.evolutionTimeline}>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineMarker}></div>
                      <p>2024: Personal prototype for self-study</p>
                    </div>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineMarker}></div>
                      <p>2025-april: Shared with 100+ beta testers</p>
                    </div>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineMarker}></div>
                      <p>2025-may: Launched publicly with premium features</p>
                    </div>
                  </div>
                  <p className={styles.finalStatement}>
                    Today, Eat Word helps thousands focus on <em>their</em>{" "}
                    words - not someone else&#39;s idea of what they should
                    learn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
