// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";


import {
  getAuth,
  // @ts-expect-error: tipos específicos do React Native
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDocJuj5oI4SRfgQiHIxvqI7GZ2aLqwKgk",
  authDomain: "mathapp-448f5.firebaseapp.com",
  projectId: "mathapp-448f5",
  storageBucket: "mathapp-448f5.firebasestorage.app",
  messagingSenderId: "277183533198",
  appId: "1:277183533198:web:9d9df8c709ae3be5f8b9df",
  measurementId: "G-8ELTFZ2P68"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

