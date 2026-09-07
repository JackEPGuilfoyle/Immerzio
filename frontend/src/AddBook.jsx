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
    <div>
      <h1>Add Book</h1>

      <form onSubmit={handleAddBook}>
        <label>
          Book title:
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter book title"
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add Book"}
        </button>
      </form>

      <button onClick={() => navigate("/home")}>
        Cancel
      </button>
    </div>
  );
}

export default AddBook;