import { useNavigate, useParams } from "react-router-dom";

function Book() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <div className="page book-page">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Your Books
        </button>

        <div className="book-hero">
          <div className="book-icon">
            📖
          </div>

          <h1>Book</h1>
        </div>

        <div className="book-actions">
          <button
            className="primary-button"
            onClick={() => navigate(`/flashcards/${bookId}`)}
          >
            Learn
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate(`/book/${bookId}/scan`)}
          >
            Scan Pages
          </button>
        </div>

      </div>
    </div>
  );
}

export default Book;