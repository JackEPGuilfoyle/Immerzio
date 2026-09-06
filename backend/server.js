const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
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
  dest: path.join(__dirname, "uploads"),
});

app.post("/api/scan", upload.single("image"), (req, res) => {
  console.log("Received image!");
  console.log("Saved to:", req.file.path);
  console.log("Size:", req.file.size, "bytes");

  res.json({
    message: "Image received successfully",
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
