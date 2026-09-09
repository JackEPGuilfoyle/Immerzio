const express = require("express");
const authenticate = require("../middleware/authenticate");
const { db } = require("../firebase/firebaseAdmin");
const { getStorage } = require("firebase-admin/storage");

const router = express.Router();

const bucket = getStorage().bucket();

router.delete("/:bookId", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const bookId = req.params.bookId;

    // Delete the book document from Firestore
    await db
      .collection("users")
      .doc(uid)
      .collection("books")
      .doc(bookId)
      .delete();

    // Delete the book's words.json from Storage
    const wordsFile = bucket.file(
      `users/${uid}/books/${bookId}/words.json`
    );

    const [exists] = await wordsFile.exists();

    if (exists) {
      await wordsFile.delete();
    }

    res.json({
      message: "Book deleted successfully",
      bookId
    });

  } catch (error) {
    console.error("DELETE BOOK FAILED:", error);

    res.status(500).json({
      message: "Failed to delete book",
      error: error.message
    });
  }
});

module.exports = router;