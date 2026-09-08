const express = require("express");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const {
  getBookWords,
  getKnownWords
} = require("../utils/bookWords");

router.get("/:bookId", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const bookId = req.params.bookId;

    const bookWords = await getBookWords(uid, bookId);
    const knownWords = await getKnownWords(uid);

    const knownSet = new Set(
      knownWords.map(word => word.original.toLowerCase())
    );

    const studySet = bookWords.filter(
      word => !knownSet.has(word.original.toLowerCase())
    );

    res.json({
      bookId,
      numberOfWords: studySet.length,
      words: studySet
    });

  } catch (error) {
    console.error("GETTING STUDY SET FAILED:", error);

    res.status(500).json({
      message: "Failed to get study set",
      error: error.message
    });
  }
});

module.exports = router;