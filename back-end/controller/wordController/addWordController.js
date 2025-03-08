import Milestone from "../../models/Milestone.js";
import Word from "../../models/Word.js";

const addWord = async (req, res) => {
  let milestone;
  try {
    // Get the word data from the request
    const {
      word,
      meanings,
      synonyms,
      definitions,
      examples,
      addedMilestone,
      addedBy,
    } = req.body;

    // Validate required fields
    if (!word || !addedMilestone || !addedBy) {
      return res
        .status(400)
        .json({ message: "Word, addedMilestone, and addedBy are required." });
    }

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
