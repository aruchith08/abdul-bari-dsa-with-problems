import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDztP1Jv7m5R0uk15fOB0hIS2H30AqGQLo",
  authDomain: "abdul-bari-dsa-with-problems.firebaseapp.com",
  projectId: "abdul-bari-dsa-with-problems",
  storageBucket: "abdul-bari-dsa-with-problems.firebasestorage.app",
  messagingSenderId: "246123352133",
  appId: "1:246123352133:web:0f0fbb56645859e15cd32c",
  measurementId: "G-11V97PM31Q"
};

// Initialize or reuse Firebase App instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
