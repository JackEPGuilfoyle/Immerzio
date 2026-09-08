const { filterText } = require("../utils/textFilter");
const { translate } = require("../utils/translator");

const processWords = async (req, res) => {

  const bookId = req.params.bookId;
  const pages = req.body.pages;

  const text = pages.join("\n");

  const dehyphenatedText = text.replace(/-\s*[|]?\s*\n\s*/g, "");
  console.log(JSON.stringify(dehyphenatedText));

  console.log("Processing book:", bookId);

  const uniqueWords = filterText(dehyphenatedText);

  console.log("Number of words:", uniqueWords.length);
  console.log("Words:", uniqueWords);
  const translatedWords = await translate(uniqueWords);

  console.log("Translated words:");
  console.log(translatedWords);

  res.json({
    message: "Processing complete!",
    bookId: bookId,
    numberOfPages: pages.length,
    numberOfWords: uniqueWords.length,
    words: uniqueWords
  });
};

module.exports = processWords;