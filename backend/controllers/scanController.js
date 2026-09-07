const { createWorker } = require("tesseract.js");

const scan = async (req, res) => {
  const bookId = req.params.bookId;

  console.log("SCAN REQUEST RECEIVED");
  console.log("Book ID:", bookId);

  if (!req.file) {
    console.log("No image received!");

    return res.status(400).json({
      message: "No image received"
    });
  }

  console.log("Image received!");
  console.log("MIME type:", req.file.mimetype);
  console.log("Size:", req.file.size, "bytes");

  try {
    console.log("Starting OCR...");

    const worker = await createWorker("deu");

    const result = await worker.recognize(req.file.buffer);

    await worker.terminate();

    const text = result.data.text;

    console.log("OCR complete!");
    console.log("Extracted text:");
    console.log(text);

    res.json({
      message: "OCR successful!",
      text: text
    });

  } catch (error) {
    console.error("OCR failed:", error);

    res.status(500).json({
      message: "OCR failed",
      error: error.message
    });
  }
};

module.exports = scan;