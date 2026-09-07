import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styles from "./RegisterPage.module.css";
import Happy from "./assets/homescreen.png";

export default function Register() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate("/mainpage");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}></div>

      <div className={styles.contentWrapper}>
        <div className={styles.titleSection}>
          <p
            style={{
              marginTop: "50px",
              marginBottom: "-45px",
              fontSize: "23px",
              color: "#00a0a0",
              WebkitTextStroke: "1px",
            }}
          >
            <b>Welcome To</b>
          </p>

          <h1
            className="main-title"
            style={{
              color: "#007777",
              WebkitTextStroke: "1px #007777",
            }}
          >
            Immerzio!
          </h1>
        </div>

        <div className={styles.form}>
          <button
            type="button"
            className={styles.loginButton}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>

          <button
            type="button"
            className={styles.registerButton}
            onClick={() => navigate("/login")}
          >
            Have an account?
          </button>
        </div>

        <img
          src={Happy}
          alt="Cat Logo"
          className={styles.catLogo}
        />
      </div>
    </div>
  );
}