import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
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
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;

      if (!user) {
        setError("You must be signed in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

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

        if (!cancelled) {
          setWords(data.words || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load study set:", error);
          setError("Failed to load study set.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [bookId]);

  const currentWord = words[currentIndex];

  const goBack = () => {
    navigate(`/book/${bookId}`);
  };

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
        setError("Your sign-in session has expired.");
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

  const markUnknown = () => {
    goToNextWord();
  };

  if (loading) {
    return (
      <div className="flashcards">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <p>Loading your words...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcards">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="flashcards">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <p>You have no words to study.</p>
        </div>

        <div className="empty-state">
          <p>
            You've learned all the words from this book.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcards">

      {/* Back navigation */}
      <div className="flashcards-navigation">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="flashcards-header">
        <h1>Flashcards</h1>
        <p>
          Learn the words you don't know yet.
        </p>
      </div>

      {/* Progress */}
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

      {/* Flashcard */}
      <div
        className={`card-scene ${
          showTranslation ? "flipped" : ""
        }`}
        onClick={() => setShowTranslation((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setShowTranslation((prev) => !prev);
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

      {/* Actions */}
      <div className="actions">

        <button
          type="button"
          className="secondary-button"
          onClick={(event) => {
            event.stopPropagation();
            markUnknown();
          }}
        >
          I don't know
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={(event) => {
            event.stopPropagation();
            markKnown();
          }}
        >
          I know this
        </button>

      </div>

    </div>
  );
};

export default FlashcardsPage;