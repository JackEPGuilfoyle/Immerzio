// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translateClient = new Translate();

async function translate(uniqueWords){ // Takes in the filtered set of words and returns a set of {"original" : "translated"} pairs

    const chunkSize = 128;
    const translationResults = [];

    for (let i = 0; i < uniqueWords.length; i += chunkSize) {
        const chunk = uniqueWords.slice(i, i + chunkSize);
        let [translations] = await translateClient.translate(chunk, "en");
        translations = Array.isArray(translations) ? translations : [translations];
        chunk.forEach((word, idx) => {
            translationResults.push({ original: word, translated: translations[idx] });
        });
    }

    // console.log('Translation Results:',translationResults);
    return translationResults;
}

module.exports = { translate };