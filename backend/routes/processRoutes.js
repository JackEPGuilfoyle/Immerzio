const express = require("express");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const processWords = require("../controllers/processController");

router.post("/:bookId", authenticate, processWords);

module.exports = router;