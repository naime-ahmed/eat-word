import { cards, dashBorderConfigs } from "../../utils.js";
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
        {cards().map((card, index) => (
          <div key={index} className={style[`card${index}`]}>
            <div>
              <img src={card.img} alt={card.alt} width="80px" height="100%" />
            </div>
            <div>{card.text}</div>
          </div>
        ))}

        {dashBorderConfigs().map((config, index) => (
          <div key={index} className={style[`dashBorder${index}`]}>
            <svg
              viewBox={config.viewBox}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id={config.id}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={config.pathColor1} />
                  <stop offset="100%" stopColor={config.pathColor2} />{" "}
                </linearGradient>
              </defs>
              <path d={config.d} className={style[`path${index}`]}></path>
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JourneyOfAWord;
