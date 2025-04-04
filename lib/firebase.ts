import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8PrQd6YlO_T6oYhyi0RGxpWVQhS-HHrs",
  authDomain: "interviewer-811db.firebaseapp.com",
  projectId: "interviewer-811db",
  storageBucket: "interviewer-811db.firebasestorage.app",
  messagingSenderId: "1036822837371",
  appId: "1:1036822837371:web:7c262797e1b502fb45cade",
  measurementId: "G-N1FXG5K6ZD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();

export { db, auth, googleAuthProvider, signInWithPopup, signOut };
