import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByAC6DDlfqOlELuCvPLJ6hc-sHrNlqGc8",
  authDomain: "immerzio-2.firebaseapp.com",
  projectId: "immerzio-2",
  storageBucket: "immerzio-2.firebasestorage.app",
  messagingSenderId: "723911069850",
  appId: "1:723911069850:web:80d290f02cac9c4c0a4f23",
  measurementId: "G-C3PZ9KJSFD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);