import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0Z8-kGEdcFcpXOJjwV0nS82-h4aIbjkA",
  authDomain: "sygmaconsult-ce177.firebaseapp.com",
  projectId: "sygmaconsult-ce177",
  storageBucket: "sygmaconsult-ce177.firebasestorage.app",
  messagingSenderId: "456471739262",
  appId: "1:456471739262:web:857eca665714baf50c112f",
  measurementId: "G-KGLC3KP9CW"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);

// Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
