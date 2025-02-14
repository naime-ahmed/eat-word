import imgForLongMemo from "../../../../assets/longTimeMemoCardIcon.png";
import imgForRevised from "../../../../assets/revisionWeekCardIcon.png";
import imgForShortMemo from "../../../../assets/shortTimeMemoCardIcon.png";
import imgForTestOnSelf from "../../../../assets/testOnSelfCardIcon.png";
import imgForListWord from "../../../../assets/wordListDownCardIcon.png";
import imgForFindWord from "../../../../assets/wordSearchCardIcon.png";
import style from "./JourneyOfAWord.module.css";

const JourneyOfAWord = () => {
  return (
    <section className={style.JourneyOfAWordContainer}>
      <div className={style.gradientLine}></div>
      <div className={style.gradientBackground}></div>
      <div className={style.JourneyOfAWordHeading}>
        <h1>
          Journey Of A <span>Word</span>
        </h1>
        <p>
          Let&#39;s see the journey of a word from being unknown to becoming
          known forever.
        </p>
      </div>
      <div className={style.JourneyOfAWordPath}>
        <div className={style.card0}>
          <div>
            <img
              src={imgForFindWord}
              alt="Image of word search"
              width="80px"
              height="100%"
            />
          </div>
          <div>Clashed with unknown word?</div>
        </div>
        <div className={style.card1}>
          <div>
            <img
              src={imgForListWord}
              alt="image of word list"
              width="80px"
              height="100%"
            />
          </div>
          <div>List it down and learn</div>
        </div>
        <div className={style.card2}>
          <div>
            <img
              src={imgForShortMemo}
              alt="image of short time memory"
              width="80px"
              height="100%"
            />
          </div>
          <div>Now it&#39;s living in your short time memory</div>
        </div>
        <div className={style.card3}>
          <div>
            <img
              src={imgForRevised}
              alt="image of revise the word for a week"
              width="80px"
              height="100%"
            />
          </div>
          <div>
            Revise either once per day or once every two days for a week.
          </div>
        </div>
        <div className={style.card4}>
          <div>
            <img
              src={imgForTestOnSelf}
              alt="image of test on self"
              width="80px"
              height="100%"
            />
          </div>
          <div>
            Each week, test yourself on all the words you&#39;ve learned. Mark
            any forgotten words in red, then start next week mission.
          </div>
        </div>
        <div className={style.card5}>
          <div>
            <img
              src={imgForLongMemo}
              alt="image of long time memory"
              width="80px"
              height="100%"
            />
          </div>
          <div>
            Successfully remembering words in your self-test indicates
            they&#39;re now part of your long-term memory.
          </div>
        </div>
        <div className={style.dashBorder0}>
          <svg
            width="0"
            height="0"
            viewBox="0 0 0 0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193"
              className={style.path0}
            ></path>
          </svg>
        </div>
        <div className={style.dashBorder1}>
          <svg
            viewBox="0 0 182 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193"
              className={style.path1}
            ></path>
          </svg>
        </div>
        <div className={style.dashBorder2}>
          <svg
            viewBox="0 0 182 181"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M180.273 1.42188C180.273 99.9447 100.436 179.752 1.875 179.752"
              className={style.path2}
            ></path>
          </svg>
        </div>
        <div className={style.dashBorder3}>
          <svg
            viewBox="0 0 182 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193"
              className={style.path3}
            ></path>
          </svg>
        </div>
        <div className={style.dashBorder4}>
          <svg
            viewBox="0 0 182 181"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M180.273 1.42188C180.273 99.9447 100.436 179.752 1.875 179.752"
              className={style.path4}
            ></path>
          </svg>
        </div>
        <div className={style.dashBorder5}>
          <svg
            viewBox="0 0 182 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193"
              className={style.path5}
            ></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default JourneyOfAWord;
