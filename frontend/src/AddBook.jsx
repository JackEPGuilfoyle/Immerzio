import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebase";

function AddBook() {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleAddBook = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(
        collection(db, "users", user.uid, "books"),
        {
          title: title.trim()
        }
      );

      navigate("/home");
    } catch (error) {
      console.error("Could not add book:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="page">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Your Books
        </button>

        <h1 className="page-title">
          Add a book
        </h1>

        <p className="page-subtitle">
          Give your new vocabulary collection a name.
        </p>

        <div className="form-card">

          <form onSubmit={handleAddBook}>

            <div className="form-group">
              <label htmlFor="book-title">
                Book title
              </label>

              <input
                id="book-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Harry Potter"
              />
            </div>

            <div className="form-actions">

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving ? "Adding..." : "Add Book"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => navigate("/home")}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddBook;