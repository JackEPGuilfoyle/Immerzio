const { filterText } = require("../utils/textFilter");

const processWords = async (req, res) => {

  const bookId = req.params.bookId;
  const pages = req.body.pages;

  const text = pages.join("\n");

  console.log("Processing book:", bookId);

  const uniqueWords = filterText(text);

  console.log("Number of words:", uniqueWords.length);
  console.log("Words:", uniqueWords);

  res.json({
    message: "Processing complete!",
    bookId: bookId,
    numberOfPages: pages.length,
    numberOfWords: uniqueWords.length,
    words: uniqueWords
  });
};

module.exports = processWords;