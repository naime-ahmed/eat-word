import styles from "./Skeleton.module.css";

const Skeleton = ({ width, height }) => {
  return (
    <div
      className={styles.skeleton}
      style={{
        width: width,
        height: height,
        maxWidth: width,
        maxHeight: height,
      }}
    ></div>
  );
};

export default Skeleton;
