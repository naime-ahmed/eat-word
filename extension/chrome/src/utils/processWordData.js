// process word data come from server
export const processWordData = (wordData, text) => {
  const processed = {
    text: text,
    result: wordData?.result || "",
    pronunciation: wordData?.pronunciation || "",
    example: null,
    definitions: {},
    translations: {},
  };
  if (
    wordData.examples &&
    Array.isArray(wordData.examples) &&
    wordData.examples.length > 0
  ) {
    processed.example = wordData.examples[0];
  }
  if (wordData.definitions && typeof wordData.definitions === "object") {
    Object.keys(wordData.definitions).forEach((type) => {
      const definitionsArray = wordData.definitions[type];
      if (Array.isArray(definitionsArray) && definitionsArray.length > 0) {
        const firstDef = definitionsArray[0];
        processed.definitions[type] = {
          definition: firstDef.definition || "",
          example: firstDef.example || "",
          synonyms: [],
        };
        if (
          firstDef.synonyms &&
          firstDef.synonyms.common &&
          Array.isArray(firstDef.synonyms.common)
        ) {
          processed.definitions[type].synonyms = firstDef.synonyms.common.slice(
            0,
            5
          );
        }
      }
    });
  }
  if (wordData.translations && typeof wordData.translations === "object") {
    Object.keys(wordData.translations).forEach((type) => {
      const translationsArray = wordData.translations[type];
      if (Array.isArray(translationsArray)) {
        processed.translations[type] = translationsArray.map((trans) => ({
          translation: trans.translation || "",
          frequency: trans.frequency || "",
          reversedTranslations: trans.reversedTranslations || [],
        }));
      }
    });
  }
  return processed;
};

// extract word data to save in database
export const extractWordData = (translationData, word) => {
  const processed = processWordData(translationData, word);

  // Define the priority order for part-of-speech.
  const priorityOrder = [
    "noun",
    "verb",
    "adjective",
    "pronoun",
    "adverb",
    "preposition",
    "conjunction",
    "interjection",
  ];

  // Extract the word (text)
  const finalWord = processed.text || "";

  // Extract Meanings
  const meaningsList = [];
  if (processed.result) {
    meaningsList.push(processed.result);
  }

  // Gather all available translations, grouped by their type.
  const translationsByType = {};
  for (const type of priorityOrder) {
    if (processed.translations?.[type]) {
      translationsByType[type] = processed.translations[type]
        .map((t) => t.translation)
        .filter(Boolean); // Ensure no empty strings
    }
  }

  // Round-robin - take one from each type in priority order.
  for (const type of priorityOrder) {
    if (meaningsList.length >= 4) break;
    if (translationsByType[type]?.length > 0) {
      const curMeaning = translationsByType[type].shift();
      if (!meaningsList.includes(curMeaning)) {
        meaningsList.push(curMeaning); // Take the first and remove it
      }
    }
  }

  // Fill remaining slots with whatever is left, in priority order.
  for (const type of priorityOrder) {
    if (meaningsList.length >= 4) break;
    if (translationsByType[type]?.length > 0) {
      const needed = 4 - meaningsList.length;
      meaningsList.push(...translationsByType[type].slice(0, needed));
    }
  }
  const meanings = meaningsList.join(", ");

  // Extract Synonyms
  const synonymsList = [];

  // Gather all available reversed translations, grouped by their type.
  const synonymsByType = {};
  for (const type of priorityOrder) {
    if (processed.translations?.[type]) {
      synonymsByType[type] = processed.translations[type]
        .flatMap((t) => t.reversedTranslations || [])
        .filter(Boolean);
    }
  }

  // Round-robin - take one from each type.
  for (const type of priorityOrder) {
    if (synonymsList.length >= 4) break;
    if (synonymsByType[type]?.length > 0) {
      const curSynonym = synonymsByType[type].shift();
      if (!synonymsList.includes(curSynonym)) {
        synonymsList.push(curSynonym);
      }
    }
  }

  // Fill remaining slots.
  for (const type of priorityOrder) {
    if (synonymsList.length >= 4) break;
    if (synonymsByType[type]?.length > 0) {
      const needed = 4 - synonymsList.length;
      synonymsList.push(...synonymsByType[type].slice(0, needed));
    }
  }
  const synonyms = synonymsList.join(", ");

  // Extract Definitions
  const definitionsList = [];
  for (const type of priorityOrder) {
    if (definitionsList.length >= 3) break;
    const definitionObj = processed.definitions?.[type];
    if (definitionObj?.definition) {
      definitionsList.push(`(${type}) ${definitionObj.definition}`);
    }
  }
  const definitions = definitionsList.join(" | ");

  // Extract the Example
  let examples = processed.example || "";

  // If the top-level example is missing, find one in the definitions.
  if (!examples) {
    for (const type of priorityOrder) {
      const definitionExample = processed.definitions?.[type]?.example;
      if (definitionExample) {
        examples = definitionExample; // Use the first one we find
        break;
      }
    }
  }

  return {
    word: finalWord,
    meanings,
    synonyms,
    definitions,
    examples,
  };
};

// design the word schema
export const wordSchemaForClient = ({
  id,
  addedBy,
  word,
  meanings = "",
  synonyms = "",
  definitions = "",
  examples = "",
}) => ({
  word: word,
  meanings: meanings,
  synonyms: synonyms,
  definitions: definitions,
  examples: examples,
  memorized: false,
  difficultyLevel: "notSpecified",
  contextTags: "",
  frequency: 0,
  notes: "",
  addedBy: addedBy,
  addedMilestone: id,
  isFavorite: false,
  learnedScore: 0,
});
