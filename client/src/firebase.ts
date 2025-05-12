// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA38kewcVeaWIUsL9ZVLWIkwmB4sQ36Z3I",
    authDomain: "sqa-assignment.firebaseapp.com",
    databaseURL: "https://sqa-assignment-default-rtdb.firebaseio.com",
    projectId: "sqa-assignment",
    storageBucket: "sqa-assignment.firebasestorage.app",
    messagingSenderId: "758570267479",
    appId: "1:758570267479:web:83c823cdf03468584d0412",
    measurementId: "G-WFBFZX0YTC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime Database instance
export const database = getDatabase(app);
