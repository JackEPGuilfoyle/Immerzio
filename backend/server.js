const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { filterText } = require("./utils/textFilter");
const { createWorker } = require("tesseract.js");
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
const scanRoutes = require("./routes/scanRoutes");
const processRoutes = require("./routes/processRoutes");
const knownWordsRoutes = require("./routes/knownWordsRoutes");
const studyRoutes = require("./routes/studyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage()
});

// Use routes
app.use("/api/scan", scanRoutes);
app.use("/api/process",processRoutes);
app.use("/api/knownWords", knownWordsRoutes);
app.use("/api/study", studyRoutes);

app.listen(port, () => console.log(`Backend running on port ${port}`));
console.log("Backend is running...");
