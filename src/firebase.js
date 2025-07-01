// src/firebase.js

// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOxi2--WyQ3SJjxJDC3yt8Uk_a6b2HJi0",
  authDomain: "ryan-availability.firebaseapp.com",
  projectId: "ryan-availability",
  storageBucket: "ryan-availability.firebasestorage.app",
  messagingSenderId: "683518243077",
  appId: "1:683518243077:web:3c1a297befbea077b0476c"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the db so other files can use it
export { db };
