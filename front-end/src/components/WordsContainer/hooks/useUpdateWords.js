import { useRef } from "react";
import useNotification from "../../../hooks/useNotification";
import {
  useAppendWordMutation,
  useEditWordMutation,
} from "../../../services/word";

export const useUpdateWords = () => {
  const newWordsSet = useRef(new Set());
  const showNotification = useNotification();
  const [appendWord, {isLoading: isAppendLoading}] = useAppendWordMutation();
  const [editWord] = useEditWordMutation();

  const updateWords = (setWords, rowIndex, columnId, value, milestoneId) => {

    // Early return if inputs are invalid
    if (
      typeof rowIndex !== "number" ||
      rowIndex < 0 ||
      !columnId ||
      value === undefined ||
      value === null
    ) {
      console.error("Invalid inputs for updateWords:", {
        rowIndex,
        columnId,
        value,
      });
      return;
    }

    setWords((prev) => {
      if (!Array.isArray(prev)) {
        console.error("Invalid `words` state:", prev);
        return prev || [];
      }

      // handle duplicate word
      if (columnId === "word") {
        for (const word of prev) {
          if (word["word"] === value) {
            showNotification({
              title: "Failed to save",
              message: `${value} already existing in the milestone!`,
              duration: 4000,
            });
            return prev;
          }
        }
      }

      // Create a copy of the previous state
      const updatedWords = prev.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      );

      // Get the word to update
      const wordToUpdate = updatedWords[rowIndex];

      // If the word is not found, return the previous state
      if (!wordToUpdate) {
        console.error("Word not found at index:", rowIndex);
        return prev;
      }

      // If the word is new (no _id), append it to the server
      if (!wordToUpdate._id) {
        if (wordToUpdate.word === "") {
          showNotification({
            title: "Failed to save",
            message: "word is required! fill the word.",
            duration: 4000,
          });
          return prev;
        }

        // Prevent duplicate append calls
        if (newWordsSet.current.has(value)) return prev;
        newWordsSet.current.add(value);

        appendWord(wordToUpdate)
          .then((res) => {
            newWordsSet.current.delete(value);
            if(res?.error){
              throw new Error(res.error?.data?.message || "something went wrong while updating word");
            }
          })
          .catch((error) => {
            console.log("word append error",error);
            showNotification({
              title: "Failed to save",
              message:
                error?.message || "something went wrong while updating word",
              iconType: "error",
              duration: 4000,
            });
            newWordsSet.current.delete(value);
          });
      } else {
        // If the word exists, update it on the server
        editWord({
          wordId: wordToUpdate._id,
          milestoneId,
          updates: { [columnId]: value },
        }).catch((error) => {
          showNotification({
            title: "Failed to save",
            message:
              error?.message || "something went wrong while updating word",
            iconType: "error",
            duration: 4000,
          });
        });
      }

      return updatedWords;
    });
  };

  return { updateWords, isAppendLoading };
};
