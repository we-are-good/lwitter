import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaS0EL8eqbcjW0WhpeNV3iVfJXYP3vlGw",
  authDomain: "lwitter-80064.firebaseapp.com",
  projectId: "lwitter-80064",
  storageBucket: "lwitter-80064.appspot.com",
  messagingSenderId: "1080173674899",
  appId: "1:1080173674899:web:a5cb18adf9a9e92c2f2866",
  measurementId: "G-X8V79F2P9Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
