import { useNavigate, useParams } from "react-router-dom";

function Book() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Book</h1>

      <button onClick={() => navigate(`/flashcards/${bookId}`)}>
        Learn
      </button>

      <button onClick={() => navigate(`/book/${bookId}/scan`)}>
        Scan
      </button>
    </div>
  );
}

export default Book;