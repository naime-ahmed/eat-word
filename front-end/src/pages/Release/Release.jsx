import { FiCalendar, FiStar, FiUsers, FiZap } from "react-icons/fi";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import styles from "./Release.module.css";

const releases = [
  {
    id: "dgfdgddsfds4355%sfd",
    version: "v0.5.0",
    date: "2025-11-15",
    wanted: "1k",
    tag: "New Feature",
    features: [
      "Develop an interactive and super personalized quiz feature with generative AI feature.",
      "Addressed critical UI/UX issues in the Home page, My Words, and Milestone page",
    ],
    hasSeeMore: false,
  },
  {
    id: "dgfdgdf2125$$%%sfd",
    version: "v0.4.0",
    date: "2025-10-20",
    wanted: "1.5k",
    tag: "bug fix",
    features: [
      "Implemented a redesigned table header and words slider incorporating rate limit indicators",
      "Addressed critical UI/UX issues in the My Words and Challenge pages",
      "Introduced a prominent notification banner for displaying important announcements on the homepage",
    ],
    hasSeeMore: false,
  },
  {
    id: "sdgdsfg3454645dfgdg",
    version: "v0.3.0",
    date: "2024-09-05",
    wanted: "2.2k",
    tag: "Core Feature",
    features: [
      "Integrated the most sought-after Generative AI technology.",
      "Create personalized stories crafted just for you, using your own words.",
      "Enhanced the user interface for frequently used features.",
    ],
    hasSeeMore: false,
  },
  {
    id: "s;ldfjslkj343434kklk",
    version: "v0.2.0",
    date: "2024-08-25",
    wanted: "1.2k",
    tag: "Core Feature",
    features: [
      "Active Recall mood",
      "Turn on the Recall mood to hide field",
      "Try to recall the meaning and build an example",
    ],
    hasSeeMore: false,
  },
  {
    id: "sfsdlkfjslj1243kkl",
    version: "v0.1.0",
    date: "2024-07-18",
    wanted: "892",
    tag: "bug fix",
    features: [
      "Resolve table row height issue",
      "Resolve popup flickering issue",
      "Resolve Profile photo upload issue",
    ],
    hasSeeMore: false,
  },
  {
    id: "sdfsfjksd343432",
    version: "v0.0.1",
    date: "2025-06-10",
    wanted: "2.4k",
    tag: "First release",
    features: [
      "Custom Word Collections",
      "Science backed Learning methods",
      "Easy, intuitive, and Seamless interface",
    ],
    hasSeeMore: false,
  },
];

const Release = () => {
  useScrollRestoration();
  return (
    <div className={styles.releasePage}>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Release Notes</h2>
        <p className={styles.subtitle}>
          Stay updated with our latest improvements
        </p>

        <div className={styles.timeline}>
          {releases.map((release) => (
            <div key={release.id} className={styles.releaseItem}>
              {/* Progress Line & Indicator */}
              <div className={styles.progressWrapper}>
                <div className={styles.progressLine} />
                <div className={styles.progressIndicator} />
              </div>

              {/* Release Card */}
              <div className={styles.releaseCard}>
                <div className={styles.releaseHeader}>
                  <div className={styles.versionWrapper}>
                    <FiZap className={styles.versionIcon} />
                    <span className={styles.version}>{release.version}</span>
                    <span className={styles.tag}>{release.tag}</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.date}>
                      <FiCalendar /> {release.date}
                    </span>
                    <span className={styles.wanted}>
                      <FiUsers /> {release.wanted} wanted
                    </span>
                  </div>
                </div>

                <ul className={styles.featureList}>
                  {release.features.map((feature, fIndex) => (
                    <li key={fIndex} className={styles.featureItem}>
                      <FiStar className={styles.featureIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {release.hasSeeMore && (
                  <PrimaryBtn
                    colorOne="rgb(86 75 255)"
                    colorTwo="rgb(54 48 163)"
                    btnType="text"
                  >
                    Learn More &#8250;
                  </PrimaryBtn>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Release;
