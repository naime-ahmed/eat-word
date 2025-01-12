import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MilestoneDeadline from "../../components/dynamicComponents/MilestoneDeadline/MilestoneDeadline";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import WordsContainer from "../../components/WordsContainer/WordsContainer";
import {
  useBringMilestonesQuery,
  useEditMilestoneMutation,
} from "../../services/milestone";
import styles from "./Milestone.module.css";

const Milestone = () => {
  // State for milestone name
  const [milestoneName, setMilestoneName] = useState("");
  const { milestoneId } = useParams();
  const { data, isLoading, isError, error } = useBringMilestonesQuery();
  const [
    editMilestone,
    {
      isLoading: isEditMileLoading,
      isError: isEditMileError,
      error: editMileError,
    },
  ] = useEditMilestoneMutation();

  const curMilestone = data?.milestones?.find(
    (milestone) => milestone._id === milestoneId
  );
  const duration = curMilestone?.milestoneType === "three" ? 3 : 7;

  // Set initial milestone name when data is loaded
  useEffect(() => {
    if (curMilestone?.name) {
      setMilestoneName(curMilestone.name);
    }
  }, [curMilestone]);

  // function to update milestone name
  const updateName = async () => {
    // if value is same but blur has called
    if (curMilestone?.name === milestoneName) {
      return;
    }
    try {
      const updatedMilestone = await editMilestone([
        milestoneId,
        { name: milestoneName },
      ]).unwrap();
      console.log("Milestone updated successfully:", updatedMilestone);
    } catch (error) {
      console.error("Error while updating milestone name:", error);
    }
  };

  // Handle input change
  const handleNameChange = (e) => {
    const newValue = e.target.value;
    setMilestoneName(newValue);
  };

  return (
    <div className={styles.milestonePage}>
      <Header />

      {isLoading ? (
        <SpinnerForPage />
      ) : (
        <div className={styles.milestoneContent}>
          {isError ? (
            <Error error={error} />
          ) : (
            <>
              <div className={styles.milestoneHeading}>
                <div className={styles.milestoneName}>
                  <input
                    type="text"
                    name="milestoneName"
                    value={milestoneName}
                    onChange={handleNameChange}
                    onBlur={updateName}
                    className={styles.milestoneNameInput}
                    disabled={isEditMileLoading} // Disable during update
                  />
                  {isEditMileError && (
                    <p className={styles.error}>
                      {editMileError?.data?.message || "Error updating name"}
                    </p>
                  )}
                </div>
                <div className={styles.milestoneTimeLeft}>
                  <MilestoneDeadline
                    createdAt={curMilestone?.createdAt}
                    duration={duration}
                  />
                </div>
              </div>
              <div className={styles.divider}></div>
              <WordsContainer curMilestone={curMilestone} />
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Milestone;
