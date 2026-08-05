const express = require("express");
const cors = require("cors");
const { admin, db } = require("./firebase/firebaseAdmin.js");

// Import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const booksRoutes = require("./routes/booksRoutes");
const knownWordsRoutes = require("./routes/knownWordsRoutes");

// Import middleware
const verifyToken = require("./middleware/verifyToken");

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use("/auth", authRoutes);          // register & login
app.use("/profile", profileRoutes);    // protected profile route
app.use("/upload", uploadRoutes);      // PDF upload
app.use("/books", booksRoutes);        // books & words routes
app.use("/knownWords", knownWordsRoutes); // known words routes

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
console.log("Backend is running...");
