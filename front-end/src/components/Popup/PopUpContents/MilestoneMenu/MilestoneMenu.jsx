import { useState } from "react";
import { BsPinAngle } from "react-icons/bs";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { useRemoveMilestoneMutation } from "../../../../services/milestone";
import Notification from "../../../Notification/Notification";
import styles from "./MilestoneMenu.module.css";

const MilestoneMenu = ({ milestone, onClose }) => {
  const [isDoNotify, setIsDoNotify] = useState(false);
  const [doNotifyTitle, setDoNotifyTitle] = useState("");
  const [doNotifyMessage, setDoNotifyMessage] = useState("");
  const [removeMilestone, { isLoading, isError, error }] =
    useRemoveMilestoneMutation();

  // handle do notify close
  const handleDoNotifyClose = () => {
    setIsDoNotify(false);
  };

  // handle delete milestone
  const handleDelete = async () => {
    try {
      // Wait for the Swal result
      const warningResult = await Swal.fire({
        title: "Are you sure?",
        text: `"${milestone?.name}" will be deleted and you won't be able to restore it`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ok, delete",
      });

      // Check if the user confirmed the delete
      if (!warningResult.isConfirmed) {
        return;
      }

      const res = await removeMilestone(milestone?._id);
      // inform the user
      setDoNotifyTitle("Delete successful");
      setDoNotifyMessage(res?.data?.message || "Milestone has been deleted");
      <Notification
        title={doNotifyTitle}
        message={doNotifyMessage}
        isOpen={isDoNotify}
        onClose={handleDoNotifyClose}
      />;
      onClose();
    } catch (error) {
      // show the error to user
      setDoNotifyTitle("Deletion failed");
      setDoNotifyMessage(error?.data?.message || "Milestone has been deleted");
      <Notification
        title={doNotifyTitle}
        message={doNotifyMessage}
        isOpen={isDoNotify}
        onClose={handleDoNotifyClose}
      />;
    }
  };
  return (
    <div className={styles.milestoneMenuContainer}>
      <ul>
        <li>
          <BsPinAngle /> Pin milestone
        </li>
        <li>
          <LiaEditSolid /> Edit milestone
        </li>
        <li onClick={handleDelete}>
          <MdOutlineDeleteOutline /> Delete milestone
        </li>
      </ul>
    </div>
  );
};

export default MilestoneMenu;
