const { filterText } = require("../utils/textFilter");
const { translate } = require("../utils/translator");
const { getBookWords, saveBookWords } = require("../utils/bookWords");

const processWords = async (req, res) => {

  const uid = req.user.uid;
  const bookId = req.params.bookId;
  const pages = req.body.pages;

  const text = pages.join("\n");

  const dehyphenatedText = text.replace(/-\s*[|]?\s*\n\s*/g, "");
  console.log(JSON.stringify(dehyphenatedText));

  console.log("Processing book:", bookId);

  const uniqueWords = filterText(dehyphenatedText);

  console.log("Number of words:", uniqueWords.length);
  console.log("Words:", uniqueWords);

  // Get words already found in this book
  const bookWords = await getBookWords(uid, bookId);

  console.log("Existing book words:", bookWords);


  // Get just the original German words
  const existingWords = new Set(
    bookWords.map(word => word.original.toLowerCase())
  );


  // Remove words we've already seen in this book
  const newWords = uniqueWords.filter(
    word => !existingWords.has(word.toLowerCase())
  );

  //ONLY translate words that aren't already in the book
  const translatedWords = await translate(newWords);

  const updatedBookWords = [
    ...bookWords,
    ...translatedWords
  ];

  await saveBookWords(uid, bookId, updatedBookWords);

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