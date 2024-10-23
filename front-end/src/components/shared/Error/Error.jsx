import styles from "./Error.module.css";

const Error = ({ error }) => {
  return (
    <div className={styles.errorContainer}>
      <p>
        {error?.data?.message} {error?.status}
      </p>
    </div>
  );
};

export default Error;
