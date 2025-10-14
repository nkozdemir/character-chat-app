import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function assertConfigValue(
  value: string | undefined,
  key: keyof typeof firebaseConfig,
) {
  if (!value) {
    throw new Error(
      `Missing Firebase configuration value for ${key}. Did you set it in your environment?`,
    );
  }
  return value;
}

function createFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }

  Object.entries(firebaseConfig).forEach(([key, value]) => {
    assertConfigValue(value, key as keyof typeof firebaseConfig);
  });

  return initializeApp(firebaseConfig);
}

const app = createFirebaseApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
