import { useRef, useState } from "react";
import {
  useAppendWordMutation,
  useEditWordMutation,
} from "../../../services/word";

export const useUpdateWords = () => {
  const [updateError, setUpdateError] = useState("");
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
      console.log("track dup set",newWordsSet.current);
      if (!Array.isArray(prev)) {
        console.error("Invalid `words` state:", prev);
        return prev || [];
      }

      // handle duplicate word
      if(columnId === "word"){
      for(const word of prev){
        if(word["word"] === value){
          setDoNotify(true);
          setUpdateError(`${value} already existing in the milestone!`);
          return prev;
        }
      }}

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
          setDoNotify(true);
          setUpdateError("word is required! fill the word.");
          return prev;
        }

        // Prevent duplicate append calls
        if (newWordsSet.current.has(value)) return prev;
        newWordsSet.current.add(value);

        appendWord(wordToUpdate).then(() => {
          newWordsSet.current.delete(value);
        }).catch((error) => {
          setDoNotify(true);
          setUpdateError(error?.message || "something went wrong while updating word");
          newWordsSet.current.delete(value);
        });
      } else {
        // If the word exists, update it on the server
        editWord({
          wordId: wordToUpdate._id,
          milestoneId,
          updates: { [columnId]: value },
        }).catch((error) => {
          setDoNotify(true);
          setUpdateError(error?.message || "something went wrong while updating word");
        });
      }

      return updatedWords;
    });
  };

  return { updateWords, updateError, doNotify, setDoNotify };
};