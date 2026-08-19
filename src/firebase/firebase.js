import { initializeApp } from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

import {
  getAuth,
} from "firebase/auth";

import {
  getStorage,
} from "firebase/storage";

// ======================================================
// FIREBASE CONFIGURATION
// ======================================================

const firebaseConfig = {
  apiKey:
    "AIzaSyD0qIdGDyHKN1bmskdlcreYqTpQX-_Vs6o",

  authDomain:
    "hari-om-furniture-house.firebaseapp.com",

  projectId:
    "hari-om-furniture-house",

  storageBucket:
    "hari-om-furniture-house.firebasestorage.app",

  messagingSenderId:
    "123445946743",

  appId:
    "1:123445946743:web:6babae9843feb1b726d972",
};

// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app =
  initializeApp(firebaseConfig);

// ======================================================
// FIRESTORE
// ======================================================

const db =
  getFirestore(app);

// ======================================================
// AUTHENTICATION
// ======================================================

const auth =
  getAuth(app);

// ======================================================
// FIREBASE STORAGE
// ======================================================

const storage =
  getStorage(app);

// ======================================================
// EXPORT
// ======================================================

export {
  app,
  db,
  auth,
  storage,
};