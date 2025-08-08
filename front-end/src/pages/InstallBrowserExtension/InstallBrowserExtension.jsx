import { useState } from "react";
import { BiSelectMultiple } from "react-icons/bi";
import { FiAlertTriangle, FiEdit3, FiSettings } from "react-icons/fi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdTranslate } from "react-icons/md";
import styles from "./InstallBrowserExtension.module.css";

const InstallBrowserExtension = () => {
  const [textareaValue, setTextareaValue] = useState(
    "Ths is an text box you can type in.\nany other site on the web will work the same   !"
  );

  return (
    <div className={styles.extensionInstallPage}>
      <div className={styles.extensionInstallPageContainer}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.checkIcon}>
            <IoCheckmarkDoneOutline />
          </div>
          <h1 className={styles.welcomeTitle}>Welcome to Eat Word!</h1>
          <p className={styles.welcomeSubtitle}>
            &#34;Eat Word&#34; browser extension is now installed and ready to
            supercharge your writing and vocabulary learning journey across the
            web!
          </p>
        </section>

        {/* Instructions Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How To Use Your Extension</h2>
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionCard}>
              <div className={styles.cardNumber}>1</div>
              <MdTranslate className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Text Lookup Tool</h3>
              <p className={styles.cardDescription}>
                Instantly translate and understand any word or sentence on any
                website.
              </p>
              <ul className={styles.cardSteps}>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Select any word or sentence on a webpage</span>
                </li>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Click the floating Eat Word icon that appears</span>
                </li>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>View translation, meaning, synonyms & examples</span>
                </li>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Save words to your milestones (if logged in)</span>
                </li>
              </ul>
            </div>

            <div className={styles.instructionCard}>
              <div className={styles.cardNumber}>2</div>
              <FiEdit3 className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Writing Assistant</h3>
              <p className={styles.cardDescription}>
                Get real-time spelling and grammar suggestions as you type on
                any website.
              </p>
              <ul className={styles.cardSteps}>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Start typing in any text editor or input field</span>
                </li>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Mistakes are automatically highlighted</span>
                </li>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Click on suggestions to apply corrections</span>
                </li>
                <li className={styles.cardStep}>
                  <div className={styles.stepDot}></div>
                  <span>Write with confidence anywhere on the web</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Example Section */}
        <section className={styles.section}>
          <div className={styles.exampleSection}>
            <h2 className={styles.sectionTitle}>Try It Out</h2>
            <p
              style={{
                textAlign: "center",
                color: "#cbd5e1",
                marginBottom: "2rem",
              }}
            >
              Test both features right here on this page!
            </p>

            <div className={styles.exampleGrid}>
              <div className={styles.exampleCard}>
                <h3 className={styles.exampleTitle}>
                  <BiSelectMultiple />
                  Text Lookup Feature
                </h3>
                <div className={styles.selectable_text}>
                  The <strong>serendipitous</strong> discovery led to a{" "}
                  <strong>paradigm</strong> shift in our understanding of{" "}
                  <strong>quantum</strong> mechanics. Scientists were{" "}
                  <strong>elated</strong> by the <strong>unprecedented</strong>{" "}
                  results.
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    marginTop: "0.5rem",
                  }}
                >
                  💡 Select any word above to test the lookup feature!
                </p>
              </div>

              <div className={styles.exampleCard}>
                <h3 className={styles.exampleTitle}>
                  <FiEdit3 />
                  Writing Assistant Feature
                </h3>
                <textarea
                  className={styles.textarea}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  placeholder="Start typing to test the writing assistant..."
                />
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    marginTop: "0.5rem",
                  }}
                >
                  ✏️ Notice the spelling mistakes? The extension will highlight
                  them!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className={styles.section}>
          <div className={styles.disclaimerSection}>
            <h2 className={styles.disclaimerTitle}>
              <FiAlertTriangle />
              🚨 Heads Up
            </h2>
            <p className={styles.disclaimerText}>
              Our extension is currently in early development and may not work
              perfectly on all websites or text editors. We&#39;re continuously
              improving the experience!
            </p>
            <p className={styles.disclaimerNote}>
              <FiSettings
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              You can disable any feature anytime by clicking the Eat Word
              extension icon in your browser toolbar and adjusting the settings.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstallBrowserExtension;
