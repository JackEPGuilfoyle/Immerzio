import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        const booksRef = collection(db, "users", user.uid, "books");
        const snapshot = await getDocs(booksRef);

        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
      } catch (error) {
        console.error("Could not load books:", error);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const deleteBook = async (bookId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user signed in");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        `https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks(prevBooks =>
        prevBooks.filter(book => book.id !== bookId)
      );

    } catch (error) {
      console.error("Could not delete book:", error);
    }
  };

  if (loading) {
    return (
      <div className="app-shell page-center">
        <p className="page-subtitle">Loading your books...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="home">

        <div className="home-header">
          <h1 className="logo">Immerzio</h1>
          <p className="page-subtitle">
            Your language library
          </p>
        </div>

        <div className="section-header">
          <h2>Your Books</h2>

          <button
            className="primary-button add-book-button"
            onClick={() => navigate("/add-book")}
          >
            + Add Book
          </button>
        </div>

        {books.length === 0 ? (
          <div className="form-card">
            <p className="page-subtitle">
              You haven't added any books yet.
            </p>
          </div>
        ) : (
          <div className="book-list">

            {books.map((book) => (
              <div
                className="book"
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <h3>{book.title}</h3>

                <button
                  className="danger-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteBook(book.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Home;