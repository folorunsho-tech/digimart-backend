// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyClrYk2s-Ay8Mb23KgHfqR2UqaenIZgIeA",
//   authDomain: "digimart-90ed2.firebaseapp.com",
//   projectId: "digimart-90ed2",
//   storageBucket: "digimart-90ed2.appspot.com",
//   messagingSenderId: "270606791992",
//   appId: "1:270606791992:web:e72c901d595f02431dbdcd",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

module.exports = { auth, db, storage, app };
