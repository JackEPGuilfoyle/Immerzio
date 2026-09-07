const { db } = require("../firebase/firebaseAdmin.js");

// Helper to fetch known words
async function getKnownWords(uid) {
  const knownWordsRef = db.collection("users").doc(uid).collection("knownWords");
  const snapshot = await knownWordsRef.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { getKnownWords };
