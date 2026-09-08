const express = require("express");

const router = express.Router();

const processWords = require("../controllers/processController");

router.post("/:bookId", processWords);

module.exports = router;