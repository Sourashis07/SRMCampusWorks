import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDAI32V7zAf9FPPlmDvUBWlBF6c-oBqp8E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "srmuniworks.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "srmuniworks",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "srmuniworks.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "399133383542",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:399133383542:web:b5b6eda9faefa6c6743857",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RQ8R9R0786"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'srmist.edu.in'
});