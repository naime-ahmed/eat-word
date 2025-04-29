import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoReloadSharp } from "react-icons/io5";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { PiCheckSquareOffset } from "react-icons/pi";
import {
  RiArrowRightSLine,
  RiBrainFill,
  RiBrainLine,
  RiDeleteBin4Line,
} from "react-icons/ri";
import { VscCircleFilled } from "react-icons/vsc";
import useNotification from "../../../../hooks/useNotification";
import { useGenerateWordInfoMutation } from "../../../../services/generativeAi";
import {
  useDeleteWordMutation,
  useEditWordMutation,
} from "../../../../services/word";
import { wordPropTypes } from "../../../../utils/propTypes";
import FancyBtn from "../../../ui/button/FancyBtn/FancyBtn";
import styles from "./TableRowMenu.module.css";

const TableRowMenu = ({
  curWord,
  onClose,
  rowIdx = undefined,
  updateRowHeight = () => {},
  comfortableLang,
  learningLang,
  setGeneratingCells,
  includeDefinition,
  learnSynonyms,
  setGenAILimit,
}) => {
  const menuItemsRef = useRef([]);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeout = useRef(null);

  const notify = useNotification();

  const [selectedFields, setSelectedFields] = useState({
    meanings: false,
    synonyms: false,
    definitions: false,
    examples: false,
  });
  const [generateWordInfo] = useGenerateWordInfoMutation();
  const [editWord, { isLoading: isEditing }] = useEditWordMutation();
  const [deleteWord, { isLoading: isDeleting }] = useDeleteWordMutation();

  const fields = ["meanings", "examples"];
  if (learnSynonyms) {
    fields.splice(1, 0, "synonyms");
  }
  if (includeDefinition) {
    fields.splice(fields.length - 1, 0, "definitions");
  }

  const handleEdit = async (editedField) => {
    try {
      await editWord({
        wordId: curWord?._id,
        milestoneId: curWord?.addedMilestone,
        updates: editedField,
      }).unwrap();
    } catch (error) {
      notify({
        title: "Action failed!",
        message: error?.data?.message || "Failed to update word.",
        iconType: "error",
        duration: 4000,
      });
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
      notify({
        title: "Action failed!",
        message: error?.data?.message || "Failed to delete word.",
        iconType: "error",
        duration: 4000,
      });
      console.error("Delete error:", error);
    }
  };

  const handleEditClick = async (action) => {
    switch (action) {
      case "memorized":
        await handleEdit({ memorized: !curWord?.memorized });
        break;
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

  const handleGenerate = async (e) => {
    e.stopPropagation();
    onClose();
    const fieldsAndLangs = {
      fields: Object.keys(selectedFields).filter(
        (field) => selectedFields[field]
      ),
      comfortableLang,
      learningLang,
    };

    if (fieldsAndLangs.fields.length === 0) {
      notify({
        title: "No Fields Selected",
        message: "Please select at least one field to generate",
        iconType: "warning",
        duration: 4000,
      });
      return;
    }

    // Add loading states
    setGeneratingCells((prev) => [
      ...prev,
      ...fieldsAndLangs.fields.map((columnId) => [rowIdx, columnId]),
    ]);

    try {
      const res = await generateWordInfo([curWord?._id, fieldsAndLangs]);
      console.log(res);
      if (res.error) {
        notify({
          title:
            res.error?.status === "FETCH_ERROR"
              ? "Network Unavailable"
              : res.error?.status === 429
              ? "Daily Limit exceeded, Try pro version!"
              : "Generation Failed",
          message:
            res.error?.data?.message ||
            "Something went wrong while generating fields, please try again later",
          iconType: "error",
          duration: 8000,
        });
        console.log(res.error);
        return;
      }

      let failedFields = "";
      for (const field of fieldsAndLangs.fields) {
        const updateData = res?.data?.updateData || {};
        if (!(field in updateData)) {
          failedFields += `${field} `;
        }
      }

      if (failedFields) {
        notify({
          title: "Failed to generate some fields",
          message: `Something went wrong while generating: ${failedFields.trim()}`,
          iconType: "error",
          duration: 6000,
        });
      }
      setGenAILimit((prev) => ({
        ...prev,
        remaining: res?.data?.rateLimit?.remaining || prev.remaining,
      }));
    } catch (error) {
      const fieldsString = fieldsAndLangs.fields.join(", ");
      notify({
        title: "Generation Failed",
        message: error?.data?.message || `Failed to generate ${fieldsString}`,
        iconType: "error",
        duration: 4000,
      });
      console.error(error);
    } finally {
      // Clear loading states
      setGeneratingCells((prev) =>
        prev.filter(
          ([r, c]) => !(r === rowIdx && fieldsAndLangs.fields.includes(c))
        )
      );
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

  // TODO: hide the filed that are not in table

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
              {fields?.map((field, index) => (
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
              ))}
              <li>
                <FancyBtn
                  clickHandler={handleGenerate}
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
          onClick={() => handleEditClick("memorized")}
          className={styles.markAsMemo}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleEditClick("memorized")}
        >
          {curWord.memorized ? (
            <>
              <RiBrainFill data-icon="memorize" />
              <span>Remove from Memorized</span>
            </>
          ) : (
            <>
              {isEditing ? <IoReloadSharp /> : <RiBrainLine />}{" "}
              <span>Mark as Memorized</span>
            </>
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
    </div>
  );
};

TableRowMenu.propTypes = {
  curWord: wordPropTypes.isRequired,
  onClose: PropTypes.func.isRequired,
  rowIdx: PropTypes.number,
  updateRowHeight: PropTypes.func.isRequired,
  comfortableLang: PropTypes.string,
  learningLang: PropTypes.string,
  setGeneratingCells: PropTypes.func.isRequired,
  learnSynonyms: PropTypes.bool,
  includeDefinition: PropTypes.bool,
  setGenAILimit: PropTypes.func.isRequired,
};

export default TableRowMenu;
