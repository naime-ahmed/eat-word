import { useRef, useState } from "react";
import {
    useAppendWordMutation,
    useEditWordMutation,
} from "../../../services/word";

export const useUpdateWords = () => {
  const [missingError, setMissingError] = useState("");
  const [doNotify, setDoNotify] = useState(false);
  const newWordsSet = useRef(new Set());

  const [appendWord] = useAppendWordMutation();
  const [editWord] = useEditWordMutation();

  const updateWords = (setWords, rowIndex, columnId, value, milestoneId) => {
    console.log("on Update", rowIndex, columnId, value);

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
      // Ensure `prev` is defined and is an array
      if (!Array.isArray(prev)) {
        console.error("Invalid `words` state:", prev);
        return prev || [];
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
          setMissingError("word is required! fill the word.");
          setDoNotify(true);
          return prev;
        }

        // Prevent duplicate append calls
        if (newWordsSet.current.has(rowIndex)) return prev;
        newWordsSet.current.add(rowIndex);

        appendWord(wordToUpdate)
          .unwrap()
          .then((response) => {
            setWords((prevWords) =>
              prevWords.map((word, index) =>
                index === rowIndex ? response?.newWord : word
              )
            );
          })
          .catch((error) => {
            console.error("Error while appending word:", error);
            setDoNotify(true);
            setMissingError("something went wrong while updating word");
            newWordsSet.current.delete(rowIndex);
          });
      } else {
        // If the word exists, update it on the server
        editWord({
          wordId: wordToUpdate._id,
          milestoneId,
          updates: { [columnId]: value },
        })
          .unwrap()
          .catch((error) => {
            console.error("Error while editing word:", error);
            setDoNotify(true);
            setMissingError("something went wrong while updating word");
          });
      }

      return updatedWords;
    });
  };

  return { updateWords, missingError, doNotify, setDoNotify };
};
