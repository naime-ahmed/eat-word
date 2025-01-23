import { useState } from "react";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  useEditMilestoneMutation,
  useRemoveMilestoneMutation,
} from "../../../../services/milestone";
import Notification from "../../../Notification/Notification";
import Popup from "../../Popup";
import EditMilestone from "../EditMilestone/EditMilestone";
import styles from "./MilestoneMenu.module.css";
import { useConfirmation } from "../../../../components/Popup/ConfirmationPopup/ConfirmationPopup";
import ConfirmationPopup from "../../../Popup/ConfirmationPopup/ConfirmationPopup";
const MilestoneMenu = ({ milestone, onMenuClose }) => {
  const [isDoNotify, setIsDoNotify] = useState(false);
  const [doNotifyTitle, setDoNotifyTitle] = useState("");
  const [doNotifyMessage, setDoNotifyMessage] = useState("");
  const [doWantEdit, setDoWantEdit] = useState(false);
  const [removeMilestone] = useRemoveMilestoneMutation();
  const [editMilestone] = useEditMilestoneMutation();
  const { confirm, confirmationProps } = useConfirmation();

  // handle do notify close
  const handleDoNotifyClose = () => {
    setIsDoNotify(false);
  };

  // handle edit milestone popup
  const handleOpenEdit = () => {
    setDoWantEdit(true);
  };
  const handleCloseEdit = () => {
    setDoWantEdit(false);
  };

  const handleTogglePin = async () => {
    try {
      await editMilestone([
        milestone?._id,
        { pinned: !milestone?.pinned || false },
      ]).then(onMenuClose());
    } catch (error) {
      <Notification
        title="Failed to Edit!"
        message={error?.data?.message || "Something went wrong while editing!"}
      />;
    }
  };

  // handle delete milestone
  const handleDelete = async () => {
    try {
      // Ask for the confirmation
      const warningResult = await confirm({
        title: "Are you sure?",
        message: `"${milestone?.name}" will be deleted permanently`,
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmColor: "#d33",
        cancelColor: "#3085d6",
      });

      if (!warningResult) {
        return;
      }

      await removeMilestone(milestone?._id);
      onMenuClose();
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
      <ConfirmationPopup {...confirmationProps} />
      <ul>
        <li onClick={handleTogglePin}>
          {milestone?.pinned ? (
            <>
              <BsPinAngleFill /> unpin milestone
            </>
          ) : (
            <>
              <BsPinAngle /> Pin milestone
            </>
          )}
        </li>
        <li onClick={handleOpenEdit}>
          <>
            <LiaEditSolid /> <span>Edit milestone</span>
            {doWantEdit && (
              <Popup isOpen={doWantEdit} onClose={handleCloseEdit}>
                <EditMilestone
                  milestone={milestone}
                  onClose={handleCloseEdit}
                />
              </Popup>
            )}
          </>
        </li>
        <li onClick={handleDelete}>
          <MdOutlineDeleteOutline /> Delete milestone
        </li>
      </ul>
    </div>
  );
};

export default MilestoneMenu;
