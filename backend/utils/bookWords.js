const { getStorage } = require("firebase-admin/storage");

const bucket = getStorage().bucket();

async function getBookWords(uid, bookId) {
  const file = bucket.file(`users/${uid}/books/${bookId}/words.json`);

  const [exists] = await file.exists();

  if (!exists) {
    return [];
  }

  const [contents] = await file.download();

  return JSON.parse(contents.toString());
}

async function saveBookWords(uid, bookId, words) {
  const file = bucket.file(`users/${uid}/books/${bookId}/words.json`);

  await file.save(
    JSON.stringify(words, null, 2),
    {
      contentType: "application/json"
    }
  );
}

module.exports = {
  getBookWords,
  saveBookWords
};