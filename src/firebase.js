// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBeHJcFtp51CiM3g7ypE4HLXElwV5Vz3kM",
  authDomain: "login-633bf.firebaseapp.com",
  projectId: "login-633bf",
  storageBucket: "login-633bf.appspot.com",
  messagingSenderId: "136055602920",
  appId: "1:136055602920:web:9e145173427cdfe4c9d35d",
  measurementId: "G-2VDDX8JBSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during sign-out:", error);
    throw error;
  }
};
