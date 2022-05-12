import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBs-3jSVAWMU1mNugqR7HSKkBhjo2ov5mY",
  authDomain: "social-blog-66f9b.firebaseapp.com",
  projectId: "social-blog-66f9b",
  storageBucket: "social-blog-66f9b.appspot.com",
  messagingSenderId: "491282193662",
  appId: "1:491282193662:web:a21087eb62eef913ffd9af",
};

let app;

// Must prevent NextJS from re-initializing
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
}

// User authentication
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider()
// Database
export const firestore = getFirestore(app);
// Storage
export const storage = getStorage(app);
