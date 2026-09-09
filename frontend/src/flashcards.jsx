import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "./firebase";

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

  const goToNextWord = () => {
    setShowTranslation(false);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

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

  const markUnknown = () => {
    goToNextWord();
  };

  const flipCard = () => {
    setShowTranslation(prev => !prev);
  };

  if (loading) {
    return (
      <div className="app-shell page-center">
        <p className="page-subtitle">Loading your words...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell page-center">
        <p>{error}</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="app-shell">
        <div className="page no-words">
          <h1 className="page-title">All caught up</h1>
          <p className="page-subtitle">
            You have no words left to study.
          </p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="app-shell">
      <div className="flashcards-page">

        <div className="flashcards-header">
          <h1 className="flashcards-title">
            Learn
          </h1>

          <span className="progress-text">
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className="card-scene"
          onClick={flipCard}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              flipCard();
            }
          }}
        >
          <div
            className={`card-inner ${
              showTranslation ? "flipped" : ""
            }`}
          >

            <div className="card-face card-front">
              <span className="card-label">
                German
              </span>

              <h2 className="card-word">
                {currentWord.original}
              </h2>

              <p className="card-hint">
                Tap to reveal
              </p>
            </div>

            <div className="card-face card-back">
              <span className="card-label">
                English
              </span>

              <h2 className="card-translation">
                {currentWord.translated}
              </h2>

              <p className="card-hint">
                Tap to flip back
              </p>
            </div>

          </div>
        </div>

        <div className="flashcard-actions">

          <button
            className="flashcard-action unknown-button"
            onClick={markUnknown}
          >
            I don't know
          </button>

          <button
            className="flashcard-action known-button"
            onClick={markKnown}
          >
            I know this
          </button>

        </div>

      </div>
    </div>
  );
};

export default FlashcardsPage;