const processWords = async (req, res) => {

  const bookId = req.params.bookId;
  const pages = req.body.pages;

  console.log("PROCESS REQUEST RECEIVED");
  console.log("Book ID:", bookId);
  console.log("Number of pages:", pages.length);

  const text = pages.join("\n");

  console.log("Combined text:");
  console.log(text);

  res.json({
    message: "Processing complete!",
    bookId: bookId,
    numberOfPages: pages.length,
    text: text
  });
};

module.exports = processWords;