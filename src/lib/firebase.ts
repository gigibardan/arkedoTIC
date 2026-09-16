import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

// Read from environment variables (e.g. Netlify/Vercel/Vite .env.local) first, then fallback to config file
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || rawConfig.apiKey || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId || '';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || rawConfig.appId || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain || '';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket || '';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId || '';
const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId || '';

const resolvedConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

try {
  if (apiKey && projectId) {
    app = !getApps().length ? initializeApp(resolvedConfig) : getApp();
    firestoreDb = firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
  } else {
    console.info(
      'ℹ️ [Firebase] VITE_FIREBASE_API_KEY nu este configurată în variabilele de mediu. Catalogul funcționează în modul local securizat.'
    );
  }
} catch (error) {
  console.warn('⚠️ [Firebase] Eroare la inițializare:', error);
}

export const db = firestoreDb;
export const isCloudConnected = Boolean(firestoreDb);
export default app;
