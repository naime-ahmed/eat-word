import PropTypes from "prop-types";
import { useState } from "react";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import useNotification from "../../../../hooks/useNotification";
import {
  useEditMilestoneMutation,
  useRemoveMilestoneMutation,
} from "../../../../services/milestone";
import { milestonePropTypes } from "../../../../utils/propTypes";
import Notification from "../../../Notification/Notification";
import ConfirmationPopup from "../../../Popup/ConfirmationPopup/ConfirmationPopup";
import Popup from "../../Popup";
import EditMilestone from "../EditMilestone/EditMilestone";
import styles from "./MilestoneMenu.module.css";

const MilestoneMenu = ({ milestone, onMenuClose }) => {
  const [doWantEdit, setDoWantEdit] = useState(false);
  const [removeMilestone] = useRemoveMilestoneMutation();
  const [editMilestone] = useEditMilestoneMutation();
  const { confirm, confirmationProps } = useConfirmation();
  const showNotification = useNotification();

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
      showNotification({
        title: "Failed to delete",
        message:
          error?.data?.message ||
          `Something went wrong while deleting ${milestone?.name}`,
        iconType: "error",
        duration: 4000,
      });
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

MilestoneMenu.propTypes = {
  milestone: milestonePropTypes,
  onMenuClose: PropTypes.func,
};
export default MilestoneMenu;
