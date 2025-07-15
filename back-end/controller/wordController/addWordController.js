import Milestone from "../../models/Milestone.js";
import Word from "../../models/Word.js";

const addWord = async (req, res) => {
  let milestone;
  try {
    // Get the word data from the request body
    const {
      word:givenWord,
      meanings,
      synonyms,
      definitions,
      examples,
      addedMilestone,
      addedBy,
    } = req.body;

    // Validate required fields
    if (!givenWord || !addedMilestone || !addedBy) {
      return res
        .status(400)
        .json({ message: "Word, addedMilestone, and addedBy are required." });
    }

    const word = givenWord.trim().toLowerCase();

    // Find the milestone
    milestone = await Milestone.findOne({ _id: addedMilestone });
    if (!milestone) {
      return res
        .status(404)
        .json({ message: "No associated milestone was found!" });
    }

    if (milestone.wordsCount === milestone.targetWords) {
      return res
        .status(404)
        .json({ message: "you've reached the milestone limit, Congrats!" });
    }

    // prevent duplicate entry
    const milestoneWords = await Word.find({
      addedBy: addedBy,
      addedMilestone: addedMilestone,
    });

    if (milestoneWords.some(curWord => curWord.word.toLowerCase() === word.toLowerCase())) {
      console.log("prevented duplicated entry");
      return res.status(409).json({ message: `${word} already exist!` });
    }

    // Update word count in milestone
    await Milestone.updateOne(
      { _id: addedMilestone },
      { $inc: { wordsCount: 1 } }
    );

    // Get the user from the request
    const user = req.user;

    // Create the word object
    const wordData = {
      word,
      meanings,
      synonyms,
      definitions,
      examples,
      addedBy: user.id,
      addedMilestone,
    };

    // Save the word
    const savedWord = await new Word(wordData).save();

    // Send success response
    res
      .status(201)
      .json({ message: "Word saved successfully", newWord: savedWord });
  } catch (error) {
    console.error("Error while saving word:", error);

    // Rollback: Decrement wordsCount if the word save failed
    if (milestone) {
      await Milestone.updateOne(
        { _id: milestone._id },
        { $inc: { wordsCount: -1 } }
      );
    }

    res
      .status(500)
      .json({ message: "An error occurred while saving the word." });
  }
};

export { addWord };
