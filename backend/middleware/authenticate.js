const { admin } = require("../firebase/firebaseAdmin");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No authentication token provided"
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    next();

  } catch (error) {
    console.error("Authentication failed:", error);

    return res.status(401).json({
      message: "Invalid authentication token"
    });
  }
};

module.exports = authenticate;