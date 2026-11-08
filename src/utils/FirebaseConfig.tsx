// utils/FirebaseConfig.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDocJuj5oI4SRfgQiHIxvqI7GZ2aLqwKgk",
  authDomain: "mathapp-448f5.firebaseapp.com",
  projectId: "mathapp-448f5",
  storageBucket: "mathapp-448f5.firebasestorage.app",
  messagingSenderId: "277183533198",
  appId: "1:277183533198:web:9d9df8c709ae3be5f8b9df",
  measurementId: "G-8ELTFZ2P68"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

