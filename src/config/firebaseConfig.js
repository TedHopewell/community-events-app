// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt0E0yUXiVfSlsgXDsGmDqIRn9WMY-BI4",
  authDomain: "event-app-de98b.firebaseapp.com",
  projectId: "event-app-de98b",
  storageBucket: "event-app-de98b.firebasestorage.app",
  messagingSenderId: "732408808323",
  appId: "1:732408808323:web:f58dfd543ea3161d1cacb6",
  measurementId: "G-2PVH3B01H0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export {auth, db}
