import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../firebase";

const FlashcardsPage = () => {
  const { bookId } = useParams();

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudySet = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setError("You must be signed in.");
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch(
          `https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/study/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load study set");
        }

        const data = await response.json();

        setWords(data.words);
      } catch (error) {
        console.error("Failed to load study set:", error);
        setError("Failed to load study set.");
      } finally {
        setLoading(false);
      }
    };

    loadStudySet();
  }, [bookId]);

  const currentWord = words[currentIndex];

  const markKnown = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user signed in");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        "https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/knownWords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            word: currentWord
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark word as known");
      }

      goToNextWord();

    } catch (error) {
      console.error("Failed to mark word as known:", error);
    }
  };

  const goToNextWord = () => {
    setShowTranslation(false);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const markUnknown = () => {
    goToNextWord();
  };

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (words.length === 0) {
    return (
      <div className="flashcards">
        <h1>Flashcards</h1>
        <p>You have no words to study.</p>
      </div>
    );
  }

  return (
    <div className="flashcards">

      <h1>Flashcards</h1>

      <div className="card">

        <h2>{currentWord.original}</h2>

        {showTranslation && (
          <div className="translation">
            {currentWord.translated}
          </div>
        )}

        {!showTranslation && (
          <button onClick={() => setShowTranslation(true)}>
            Reveal
          </button>
        )}

      </div>

      {showTranslation && (
        <div className="actions">

          <button onClick={markUnknown}>
            I don't know
          </button>

          <button onClick={markKnown}>
            I know this
          </button>

        </div>
      )}

      <p>
        {currentIndex + 1} / {words.length}
      </p>

    </div>
  );
};

export default FlashcardsPage;