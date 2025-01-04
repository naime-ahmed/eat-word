export const calculateColumnWidths = (curMilestone) => {
  let wordSize = 170;
  let meaningSize = 225;
  let synonymsSize = curMilestone?.learnSynonyms ? 225 : 0;
  let definitionsSize = curMilestone?.includeDefinition ? 280 : 0;

  // Adjust widths if synonyms or definitions columns are missing
  if (synonymsSize === 0 && definitionsSize !== 0) {
    wordSize += Math.round(225 / 7);
    meaningSize += Math.round(225 / 5);
    definitionsSize += Math.round(225 / 4);
  } else if (synonymsSize !== 0 && definitionsSize === 0) {
    wordSize += Math.round(280 / 7);
    meaningSize += Math.round(280 / 5);
    synonymsSize += Math.round(280 / 5);
  } else if (synonymsSize === 0 && definitionsSize === 0) {
    wordSize += Math.round(505 / 7);
    meaningSize += Math.round(505 / 5);
  }

  const examplesSize =
    1250 - (wordSize + meaningSize + synonymsSize + definitionsSize);

  return {
    wordSize,
    meaningSize,
    synonymsSize,
    definitionsSize,
    examplesSize,
  };
};

export const wordSchemaForClient = (curMilestone) => ({
  word: "",
  meanings: "",
  synonyms: "",
  definitions: "",
  examples: "",
  memorized: false,
  difficultyLevel: "notSpecified",
  contextTags: "",
  frequency: 0,
  notes: "",
  addedBy: curMilestone?.addedBy,
  addedMilestone: curMilestone?._id,
  isFavorite: false,
  learnedScore: 0,
});