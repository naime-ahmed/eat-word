import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "./Milestone.module.css";

const Milestone = () => {
  const { user } = useSelector((state) => state.auth);

  const { milestoneId } = useParams();

  return (
    <div className={styles.milestonePage}>
      Welcome to milestone {user.email} sir, milestone : {milestoneId}, you :{" "}
      {user.id}
    </div>
  );
};

export default Milestone;
