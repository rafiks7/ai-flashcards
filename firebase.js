// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: `process.env.FIREBASE_API_KEY`,
  authDomain: "ai-flashcards-5b6c4.firebaseapp.com",
  projectId: "ai-flashcards-5b6c4",
  storageBucket: "ai-flashcards-5b6c4.appspot.com",
  messagingSenderId: "572318878584",
  appId: "1:572318878584:web:48b2647e3a07444b0ed68d",
  measurementId: "G-E9MKPCXV3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== 'undefined') {
  // Client-side code
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
const db = getFirestore(app)
export {db, analytics}