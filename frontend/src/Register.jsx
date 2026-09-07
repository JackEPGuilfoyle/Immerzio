import React from "react";
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
    <div>
      <h1>Create an Immerzio account</h1>

      <button onClick={handleGoogleSignIn}>
        Continue with Google
      </button>
    </div>
  );
}

export default Register;