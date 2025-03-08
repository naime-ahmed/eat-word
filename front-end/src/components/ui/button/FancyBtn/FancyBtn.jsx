import styles from "./FancyBtn.module.css";

const FancyBtn = ({
  children,
  clickHandler = () => {},
  btnWidth,
  btnHeight,
  leftColor = "#0400ff",
  rightColor = "#4ce3f7",
  fontSize = "16px",
  degree = "30deg",
}) => {
  const linearGradient = (degree, leftColor, rightColor) =>
    `linear-gradient(${degree}, ${leftColor}, ${rightColor})`;

  return (
    <button
      onClick={clickHandler}
      style={{
        width: btnWidth,
        height: btnHeight,
        fontSize: fontSize,
        backgroundImage: linearGradient(degree, leftColor, rightColor),
      }}
      className={styles.fancyBtn}
    >
      {children}
    </button>
  );
};

export default FancyBtn;
