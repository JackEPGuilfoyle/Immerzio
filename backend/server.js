const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { admin, db } = require("./firebase/firebaseAdmin.js");
const port = process.env.PORT || 8080;

// Import routes
// const authRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const uploadRoutes = require("./routes/uploadRoutes");
// const booksRoutes = require("./routes/booksRoutes");
// const knownWordsRoutes = require("./routes/knownWordsRoutes");

// Import middleware
// const verifyToken = require("./middleware/verifyToken");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/api/test", (req, res) => {
  console.log("Frontend contacted the backend!");

  res.json({
    message: "Hello from the Immerzio backend!"
  });
});

app.post("/api/scan", upload.single("image"), (req, res) => {
  console.log("SCAN REQUEST RECEIVED");

  console.log("File:", req.file);

  if (!req.file) {
    console.log("No image received!");

    return res.status(400).json({
      message: "No image received"
    });
  }

  console.log("Image received!");
  console.log("MIME type:", req.file.mimetype);
  console.log("Size:", req.file.size, "bytes");

  res.json({
    message: "Image received successfully!",
    filename: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});
// Use routes
// app.use("/auth", authRoutes);          // register & login
// app.use("/profile", profileRoutes);    // protected profile route
// app.use("/upload", uploadRoutes);      // PDF upload
// app.use("/books", booksRoutes);        // books & words routes
// app.use("/knownWords", knownWordsRoutes); // known words routes

app.listen(port, () => console.log(`Backend running on port ${port}`));
console.log("Backend is running...");
