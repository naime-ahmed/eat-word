import wordCloud from "../../../../assets/wordcloudone.webp";
import style from "./Hero.module.css";
// https://langeek.co/
// https://www.wordclouds.com/
const Hero = () => {
  return (
    <div className={style.heroContainer}>
      <div>
        <h1>Your Words Your Mastery</h1>
        <p>
          Personalize your vocabulary journey with AI powered insights. Crafted
          just for you
        </p>
        <button>Get start for free</button>
      </div>
      <div className={style.heroImageContainer}>
        <img src={wordCloud} alt="word cloud in shape of world" />
      </div>
    </div>
  );
};

export default Hero;
