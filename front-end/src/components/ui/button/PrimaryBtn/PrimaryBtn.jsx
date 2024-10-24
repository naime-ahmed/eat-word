import styles from "./PrimaryBtn.module.css";

const PrimaryBtn = ({
  handleClick = () => {},
  isLoading = false,
  colorOne = "#0a4bae",
  colorTwo = "#0c80c9",
  children,
  btnType = "",
}) => {
  return (
    <button
      onClick={handleClick}
      type={btnType}
      style={{
        backgroundImage: `linear-gradient(to left, ${colorOne}, ${colorTwo})`,
      }}
      className={styles.btn}
      disabled={isLoading}
    >
      {isLoading ? "creating..." : children}
    </button>
  );
};

export default PrimaryBtn;
