const express = require("express");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const {
  getKnownWords,
  saveKnownWords
} = require("../utils/bookWords");

router.post("/", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const word = req.body.word;

    if (!word || !word.original || !word.translated) {
      return res.status(400).json({
        message: "Invalid word"
      });
    }

    const knownWords = await getKnownWords(uid);

    const alreadyKnown = knownWords.some(
      knownWord =>
        knownWord.original.toLowerCase() === word.original.toLowerCase()
    );

    if (!alreadyKnown) {
      knownWords.push(word);

      await saveKnownWords(uid, knownWords);
    }

    res.json({
      message: "Word added to known words",
      word
    });

  } catch (error) {
    console.error("ADDING KNOWN WORD FAILED:", error);

    res.status(500).json({
      message: "Failed to add known word",
      error: error.message
    });
  }
});

module.exports = router;