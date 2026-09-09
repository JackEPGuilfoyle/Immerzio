import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "./firebase";

const FlashcardsPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

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
              Authorization: `Bearer ${token}`,
            },
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            word: currentWord,
          }),
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
    return (
      <div className="flashcards">
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcards">
        <button
          className="back-button"
          onClick={() => navigate(`/book/${bookId}`)}
        >
          ← Back
        </button>

        <p>{error}</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="flashcards">
        <button
          className="back-button"
          onClick={() => navigate(`/book/${bookId}`)}
        >
          ← Back
        </button>

        <h1>Flashcards</h1>

        <div className="empty-state">
          <p>You have no words to study.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcards">

      <button
        className="back-button"
        onClick={() => navigate(`/book/${bookId}`)}
      >
        ← Back
      </button>

      <div className="flashcards-header">
        <h1>Flashcards</h1>

        <p>
          Learn the words you don't know yet.
        </p>
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / words.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div
        className={`card-scene ${
          showTranslation ? "flipped" : ""
        }`}
        onClick={() => setShowTranslation(!showTranslation)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setShowTranslation(!showTranslation);
          }
        }}
      >
        <div className="flashcard">

          <div className="flashcard-face flashcard-front">
            <span className="card-label">
              German
            </span>

            <h2>
              {currentWord.original}
            </h2>

            <p className="card-hint">
              Tap to reveal
            </p>
          </div>

          <div className="flashcard-face flashcard-back">
            <span className="card-label">
              English
            </span>

            <h2>
              {currentWord.translated}
            </h2>

            <p className="card-hint">
              Tap to flip back
            </p>
          </div>

        </div>
      </div>

      {showTranslation && (
        <div className="actions">

          <button
            className="secondary-button"
            onClick={(event) => {
              event.stopPropagation();
              markUnknown();
            }}
          >
            I don't know
          </button>

          <button
            className="primary-button"
            onClick={(event) => {
              event.stopPropagation();
              markKnown();
            }}
          >
            I know this
          </button>

        </div>
      )}

    </div>
  );
};

export default FlashcardsPage;