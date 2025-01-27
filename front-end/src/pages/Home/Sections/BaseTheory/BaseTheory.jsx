import fewMoreThings from "../../../../assets//fewMoreThings.png";
import activeRecall from "../../../../assets/activeRecall.png";
import contextualLearning from "../../../../assets/contextualLearning.png";
import spacedRepetition from "../../../../assets/spacedRepetition.png";
import style from "./BaseTheory.module.css";

const BaseTheory = () => {
  return (
    <div className={style.baseTheoryContainer}>
      <div className={style.gradientLine}></div>
      <div className={style.gradientBackground}></div>
      <div className={style.baseTheoryHeading}>
        <h1>The premise of Eat Word</h1>
        <p>
          Eat Word is designed to help you learn vocabulary through three
          scientifically <br /> proven concepts, making the learning process
          easy, fast, and effective.
        </p>
      </div>
      <div className={style.baseTheoryCardsContainer}>
        <div className={style.spacedRepetition}>
          <div>
            <img src={spacedRepetition} alt="spaced Repetition" />
          </div>
          <h2>Spaced Repetition</h2>
          <p>
            Spaced Repetition is when you review words at different times, with
            breaks in between. Instead of studying everything at once, you look
            at the words again after a few days, then later, and so on. This
            helps your brain remember the words for a longer time.
          </p>
        </div>
        <div className={style.activeRecall}>
          <div>
            <img src={activeRecall} alt="spaced Repetition" />
          </div>
          <h2>Active Recall</h2>
          <p>
            Active Recall is when you try to remember what you have learned
            without looking at the answers. For example, you think about the
            meaning of a word or use it in a sentence from memory. This makes
            your memory stronger and helps you learn better.
          </p>
        </div>
        <div className={style.contextualLearning}>
          <div>
            <img src={contextualLearning} alt="spaced Repetition" />
          </div>
          <h2>Contextual Learning</h2>
          <p>
            Contextual Learning is about understanding how words are used in
            real-life situations. Instead of just learning what a word means,
            you see it in sentences or conversations. This helps you know when
            and how to use the word correctly, making it easier to remember.
          </p>
        </div>
        <div className={style.fewMoreThings}>
          <div>
            <img src={fewMoreThings} alt="spaced Repetition" />
          </div>
          <h2>Where to find words?</h2>
          <p>
            You might be wondering where to find the words you need to learn.
            It’s simple: while reading a newspaper, watching a movie or series,
            or scrolling through social media, whenever you come across a word
            you don’t understand, note it down. This system will help you
            remember it for good.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BaseTheory;
