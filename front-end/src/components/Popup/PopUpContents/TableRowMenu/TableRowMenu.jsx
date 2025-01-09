import { useRef, useState } from "react";
import { IoReloadSharp } from "react-icons/io5";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { RiDeleteBin4Line } from "react-icons/ri";
import { VscCircleFilled } from "react-icons/vsc";
import {
  useDeleteWordMutation,
  useEditWordMutation,
} from "../../../../services/word";
import Notification from "../../../Notification/Notification";
import styles from "./TableRowMenu.module.css";

const TableRowMenu = ({ curWord, onClose, rowIdx, updateRowHeight }) => {
  const [doNotify, setDoNotify] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const menuItemsRef = useRef([]); // Ref to store menu item elements

  const [editWord, { isLoading: isEditing }] = useEditWordMutation();
  const [deleteWord, { isLoading: isDeleting }] = useDeleteWordMutation();

  const handleCloseNotify = () => {
    setDoNotify(false);
  };

  const handleEdit = async (editedField) => {
    try {
      await editWord({
        wordId: curWord?._id,
        milestoneId: curWord?.addedMilestone,
        updates: editedField,
      }).unwrap();
    } catch (error) {
      setNotificationMessage(error?.data?.message || "Failed to update word.");
      setNotificationTitle("Action failed!");
      setDoNotify(true);
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWord({
        wordId: curWord?._id,
        milestoneId: curWord?.addedMilestone,
      }).unwrap();
      onClose();
      updateRowHeight(rowIdx, "", "", "delete");
    } catch (error) {
      setNotificationTitle("Action failed!");
      setNotificationMessage(error?.data?.message || "Failed to delete word.");
      setDoNotify(true);
      console.error("Delete error:", error);
    }
  };

  const handleEditClick = async (action) => {
    switch (action) {
      case "favorite":
        await handleEdit({ isFavorite: !curWord?.isFavorite });
        break;
      case "hard":
        await handleEdit({
          difficultyLevel:
            curWord?.difficultyLevel === "hard" ? "notSpecified" : "hard",
        });
        break;
      case "delete":
        await handleDelete();
        break;
      default:
        break;
    }
  };

  // Handle arrow key navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); // Prevent default scrolling behavior

      // Get the currently focused item index
      const currentIndex = menuItemsRef.current.indexOf(document.activeElement);

      let nextIndex;
      if (e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % menuItemsRef.current.length;
      } else if (e.key === "ArrowUp") {
        nextIndex =
          (currentIndex - 1 + menuItemsRef.current.length) %
          menuItemsRef.current.length;
      }

      // Focus the next/previous item
      if (nextIndex !== undefined) {
        menuItemsRef.current[nextIndex].focus();
      }
    }
  };

  return (
    <div className={styles.rowMenuContainer}>
      <ul onKeyDown={handleKeyDown}>
        <li
          ref={(el) => (menuItemsRef.current[0] = el)}
          onClick={() => handleEditClick("favorite")}
          className={styles.markAsFav}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleEditClick("favorite")}
        >
          {curWord.isFavorite ? (
            <>
              <MdFavorite data-icon="favorite" />{" "}
              <span>Remove from Favorite</span>
            </>
          ) : (
            <>
              {isEditing ? <IoReloadSharp /> : <MdFavoriteBorder />}{" "}
              <span>Mark as Favorite</span>
            </>
          )}
        </li>
        <li
          ref={(el) => (menuItemsRef.current[1] = el)}
          onClick={() => handleEditClick("hard")}
          className={styles.markHard}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleEditClick("hard")}
        >
          {curWord.difficultyLevel === "hard" ? (
            <>
              <VscCircleFilled data-icon="hard" /> Remove from hard
            </>
          ) : (
            <>
              {isEditing ? <IoReloadSharp /> : <VscCircleFilled />} Mark as hard
            </>
          )}
        </li>
        <li
          ref={(el) => (menuItemsRef.current[2] = el)}
          onClick={() => handleEditClick("delete")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleEditClick("delete")}
        >
          {isDeleting ? <IoReloadSharp /> : <RiDeleteBin4Line />} Delete word
        </li>
      </ul>
      {doNotify && (
        <Notification
          title={notificationTitle}
          message={notificationMessage}
          isOpen={doNotify}
          onClose={handleCloseNotify}
        />
      )}
    </div>
  );
};

export default TableRowMenu;
