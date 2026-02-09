// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

// Initialize Firebase
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | undefined = undefined;

try {
  if (missingEnvVars.length === 0) {
    app = initializeApp(firebaseConfig);
    // Initialize Analytics only if measurementId is provided
    if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.warn('Analytics initialization failed:', analyticsError);
      }
    }
    // Initialize Firestore
    db = getFirestore(app);
  } else {
    console.warn(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.warn('Please check your .env file and ensure all Firebase configuration variables are set.');
    console.warn('The app will still load, but Firebase features may not work.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  console.error('The app will still render, but Firebase operations will fail.');
}

// Export the initialized services
// Note: db and analytics may be null if initialization failed
export { db, analytics };
