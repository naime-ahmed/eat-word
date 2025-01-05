import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { RiDeleteBin4Line } from "react-icons/ri";
import { VscCircleFilled } from "react-icons/vsc";
import {
  useDeleteWordMutation,
  useEditWordMutation,
} from "../../../../services/word";
import styles from "./TableRowMenu.module.css";

const TableRowMenu = ({ curWord, onClose }) => {
  const [editWord, { isLoading, isError, error }] = useEditWordMutation();
  const [
    deleteWord,
    { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError },
  ] = useDeleteWordMutation();

  console.log(curWord);
  const handleEdit = (editedField) => {
    try {
      editWord({
        wordId: curWord?._id,
        milestoneId: curWord?.addedMilestone,
        updates: editedField,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = async (action, payload = "") => {
    switch (action) {
      case "favorite":
        handleEdit({ isFavorite: !curWord?.isFavorite });
        break;
      case "hard":
        if (curWord?.difficultyLevel === "hard") {
          handleEdit({ difficultyLevel: "notSpecified" });
        } else {
          handleEdit({ difficultyLevel: "hard" });
        }
        break;
      case "delete":
        try {
          deleteWord({
            wordId: curWord?._id,
            milestoneId: curWord?.addedMilestone,
          }).then(onClose());
        } catch (error) {
          console.log(error);
        }

        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.rowMenuContainer}>
      <ul>
        <li
          onClick={() => handleEditClick("favorite")}
          className={styles.markAsFav}
        >
          {curWord.isFavorite ? (
            <>
              <MdFavorite data-icon="favorite" />{" "}
              <span>Remove from Favorite</span>
            </>
          ) : (
            <>
              <MdFavoriteBorder /> <span>Mark as Favorite</span>
            </>
          )}
        </li>
        <li onClick={() => handleEditClick("hard")} className={styles.markHard}>
          {curWord.difficultyLevel === "hard" ? (
            <>
              <VscCircleFilled data-icon="hard" /> Remove from hard
            </>
          ) : (
            <>
              <VscCircleFilled /> Mark as hard
            </>
          )}
        </li>
        <li onClick={() => handleEditClick("delete")}>
          <RiDeleteBin4Line /> Delete word
        </li>
      </ul>
    </div>
  );
};

export default TableRowMenu;
