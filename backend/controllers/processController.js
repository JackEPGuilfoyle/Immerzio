const processWords = async (req, res) => {
  const bookId = req.params.bookId;
  const pages = req.body.pages;

  console.log("PROCESS REQUEST RECEIVED");
  console.log("Book ID:", bookId);
  console.log("Number of pages:", pages.length);
  console.log("Pages:", pages);

  res.json({
    message: "Processing received!",
    bookId: bookId,
    numberOfPages: pages.length
  });
};

module.exports = processWords;