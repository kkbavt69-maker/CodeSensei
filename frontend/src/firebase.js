// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBYoPOSKG7Jyq6mqN2Upajv8G_7Lyb-gFk",
  authDomain: "codesensei-ed88f.firebaseapp.com",
  projectId: "codesensei-ed88f",
  storageBucket: "codesensei-ed88f.appspot.com",
  messagingSenderId: "811432065215",
  appId: "1:811432065215:web:be4e76ec19549e74096e0a",
  measurementId: "G-DX2LTHTZRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);