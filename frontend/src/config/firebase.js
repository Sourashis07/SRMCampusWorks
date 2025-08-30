import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDAI32V7zAf9FPPlmDvUBWlBF6c-oBqp8E",
  authDomain: "srmuniworks.firebaseapp.com",
  projectId: "srmuniworks",
  storageBucket: "srmuniworks.firebasestorage.app",
  messagingSenderId: "399133383542",
  appId: "1:399133383542:web:b5b6eda9faefa6c6743857",
  measurementId: "G-RQ8R9R0786"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Restrict to college emails
googleProvider.setCustomParameters({
  hd: 'srmist.edu.in' // Replace with your college domain
});