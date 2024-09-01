import thumbnail from "../../../../assets/thumbnailForTutorial.png";
import video from "../../../../assets/tmpVideoForTutorial.mp4";
import style from "./Tutorials.module.css";

const Tutorials = () => {
  return (
    <div className={style.tutorialsContainer}>
      <div className={style.tutorialsTextContainer}>
        <h1>
          Get Started with <span>your words</span>
        </h1>
        <p>
          Watch this short tutorial to see how you can start mastering your
          words.
        </p>
      </div>
      <div className={style.tutorialsVideoContainer}>
        <video poster={thumbnail} controls>
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Tutorials;
