const express = require("express");
const multer = require("multer");

const router = express.Router();

const scan = require("../controllers/scanController");

const upload = multer({
  storage: multer.memoryStorage()
});

router.post("/:bookId", upload.single("image"), scan);

module.exports = router;