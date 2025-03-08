import PropTypes from "prop-types";

// milestone prop types

export const milestonePropTypes = PropTypes.shape({
  _id: PropTypes.string,
  addedBy: PropTypes.string,
  learnSynonyms: PropTypes.bool,
  includeDefinition: PropTypes.bool,
  createdAt: PropTypes.string,
  memorizedCount: PropTypes.number,
  milestoneType: PropTypes.string,
  name: PropTypes.string,
  pinned: PropTypes.bool,
  revisionCount: PropTypes.number,
  targetWords: PropTypes.number,
  updatedAt: PropTypes.string,
  wordsCount: PropTypes.number,
  __v: PropTypes.number,
});

// word prop types
export const wordPropTypes = PropTypes.shape({
  addedBy: PropTypes.string,
  addedMilestone: PropTypes.string,
  contextTags: PropTypes.string,
  word: PropTypes.string,
  meanings: PropTypes.string,
  synonyms: PropTypes.string,
  definitions: PropTypes.string,
  examples: PropTypes.string,
  difficultyLevel: PropTypes.string,
  frequency: PropTypes.number,
  isFavorite: PropTypes.bool,
  learnedScore: PropTypes.number,
  memorized: PropTypes.bool,
  notes: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  _id: PropTypes.string,
  __v: PropTypes.number,
});

// slider card prop type
export const sliderCardPropTypes = {
  word: wordPropTypes,
  wordIdx: PropTypes.number.isRequired,
  setWords: PropTypes.func.isRequired,
  curMilestone: milestonePropTypes,
};
