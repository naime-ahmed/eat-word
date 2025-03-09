import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoReloadSharp } from "react-icons/io5";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { PiCheckSquareOffset } from "react-icons/pi";
import { RiArrowRightSLine, RiDeleteBin4Line } from "react-icons/ri";
import { VscCircleFilled } from "react-icons/vsc";
import { useGenerateWordInfoMutation } from "../../../../services/generativeAi";
import {
  useDeleteWordMutation,
  useEditWordMutation,
} from "../../../../services/word";
import { wordPropTypes } from "../../../../utils/propTypes";
import Notification from "../../../Notification/Notification";
import FancyBtn from "../../../ui/button/FancyBtn/FancyBtn";
import styles from "./TableRowMenu.module.css";

const TableRowMenu = ({
  curWord,
  onClose,
  rowIdx = undefined,
  updateRowHeight = () => {},
  comfortableLang,
  learningLang,
}) => {
  const [doNotify, setDoNotify] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const menuItemsRef = useRef([]);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeout = useRef(null);

  const [selectedFields, setSelectedFields] = useState({
    meanings: false,
    synonyms: false,
    definitions: false,
    examples: false,
  });
  const [
    generateWordInfo,
    {
      isLoading: isGenerating,
      isError: isGeneratingError,
      error: generartingError,
    },
  ] = useGenerateWordInfoMutation();
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
      });
      updateRowHeight(rowIdx, "", "", "delete");
      onClose();
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

  const handleFieldChange = (field) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleApply = async (e) => {
    e.stopPropagation();
    onClose();
    const fieldsAndLangs = {
      fields: Object.keys(selectedFields).filter(
        (field) => selectedFields[field]
      ),
      comfortableLang,
      learningLang,
    };
    try {
      const res = await generateWordInfo([curWord?._id, fieldsAndLangs]);
      console.log("generated infos", res);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle arrow key navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();

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
        {/* Nested list for field selection */}
        <li
          ref={(el) => (menuItemsRef.current[0] = el)}
          className={styles.parentMenuItem}
          onMouseEnter={() => {
            if (closeTimeout.current) {
              clearTimeout(closeTimeout.current);
              setIsClosing(false);
            }
            setShowSubmenu(true);
          }}
          onMouseLeave={() => {
            setIsClosing(true);
            closeTimeout.current = setTimeout(() => {
              setShowSubmenu(false);
              setIsClosing(false);
            }, 500);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSubmenu(!showSubmenu);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <HiOutlineSparkles className={styles.sparkleIcon} /> Generate with Ai
          <span className={styles.arrowIcon}>
            <RiArrowRightSLine />
          </span>
          {showSubmenu && (
            <ul
              className={`${styles.nestedList} ${
                isClosing ? styles.closing : ""
              }`}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => {
                if (closeTimeout.current) {
                  clearTimeout(closeTimeout.current);
                  setIsClosing(false);
                }
              }}
            >
              {["meanings", "synonyms", "definitions", "examples"].map(
                (field, index) => (
                  <li key={field}>
                    <label className={styles.inputWrapper}>
                      <input
                        type="checkbox"
                        checked={selectedFields[field]}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleFieldChange(field);
                        }}
                        ref={(el) => (menuItemsRef.current[index] = el)}
                      />
                      <span className={styles.checkmark} />
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </li>
                )
              )}
              <li>
                <FancyBtn
                  clickHandler={handleApply}
                  btnWidth="100%"
                  fontSize="15px"
                  leftColor="#f672ff"
                  rightColor="#2b1fff"
                >
                  {/* <RiAiGenerate />*/}
                  <PiCheckSquareOffset />
                  Generate
                </FancyBtn>
              </li>
            </ul>
          )}
        </li>
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

TableRowMenu.propTypes = {
  curWord: wordPropTypes.isRequired,
  onClose: PropTypes.func.isRequired,
  rowIdx: PropTypes.number,
  updateRowHeight: PropTypes.func,
  comfortableLang: PropTypes.string,
  learningLang: PropTypes.string,
};

export default TableRowMenu;
