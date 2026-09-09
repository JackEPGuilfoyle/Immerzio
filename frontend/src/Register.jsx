import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

function Register() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate("/home");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="app-shell page-center">

      <div className="register-page">

        <div className="register-logo">
          I
        </div>

        <h1>
          Learn languages<br />
          through books.
        </h1>

        <p>
          Scan the books you're reading and turn their vocabulary
          into personalised flashcards.
        </p>

        <button
          className="primary-button"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </button>

      </div>

    </div>
  );
}

export default Register;