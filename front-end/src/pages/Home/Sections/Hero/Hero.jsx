import wordCloud from "../../../../assets/wordcloudone.webp";
import style from "./Hero.module.css";
// https://langeek.co/
// https://www.wordclouds.com/
const Hero = () => {
  return (
    <div className={style.heroContainer}>
      <div className={style.heroTextContainer}>
        <h1>
          Your Words <br /> Your Mastery
        </h1>
        <p>
          Personalize your vocabulary journey with <br /> AI powered insights.
          Crafted just for you.
        </p>
        <button className={style.callToAction}>Get start for free</button>
      </div>
      <div className={style.heroImageContainer}>
        <img src={wordCloud} alt="word cloud in shape of world" />
      </div>
    </div>
  );
};

export default Hero;
