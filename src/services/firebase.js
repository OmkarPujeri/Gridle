// Firebase Realtime Database initialization.
// Config comes from Vite env vars (VITE_FIREBASE_*) defined in .env.local — see
// .env.example. Keep this file free of game logic; it only exposes the db handle.
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// True only when the required keys are present. Lets the UI show a friendly
// "multiplayer not configured" message instead of crashing on a missing config.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.databaseURL && firebaseConfig.apiKey
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getDatabase(app) : null;
