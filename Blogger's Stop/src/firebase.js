import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhvQtbURTMuLP7Z4-ZeAgmqP-vAyx6QJM",
  authDomain: "blogging-fd5a9.firebaseapp.com",
  projectId: "blogging-fd5a9",
  storageBucket: "blogging-fd5a9.firebasestorage.app",
  messagingSenderId: "114255698963",
  appId: "1:114255698963:web:310c0baaae9750b5e133e6"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
