import Word from "../../models/Word.js";

const addWord = async (req, res) => {
  try {
    // Get the word data from the request
    const { word, meanings, synonyms, definitions, examples, addedMilestone } =
      req.body;

    // Validate required fields
    if (!word || !addedMilestone) {
      return res
        .status(400)
        .json({ message: "Word and addedMilestone are required." });
    }

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
    res.status(201).json({ message: "saved" });
  } catch (error) {
    console.error("Error while saving word:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the word." });
  }
};

export { addWord };
