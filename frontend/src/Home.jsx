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

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div className="home">
      <h1>Immerzio</h1>

      <h2>Your Books</h2>

      <button onClick={() => navigate("/add-book")}>
        Add Book
      </button>

      {books.length === 0 ? (
        <p>You haven't added any books yet.</p>
      ) : (
        <div className="book-list">
            {books.map((book) => (
                <div
                className="book"
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                >
                <h3>{book.title}</h3>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Home;