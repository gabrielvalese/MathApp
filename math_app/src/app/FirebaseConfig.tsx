// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);