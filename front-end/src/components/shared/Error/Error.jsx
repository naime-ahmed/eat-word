import styles from "./Error.module.css";

const Error = ({ error }) => {
  return (
    <div className={styles.errorContainer}>
      <p>{error?.data?.message}</p>
    </div>
  );
};

export default Error;
