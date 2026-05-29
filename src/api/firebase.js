import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu5kDGUt7Jnxj5TWpyiWfsdTPNT6TH88g",
  authDomain: "chronus-986fd.firebaseapp.com",
  projectId: "chronus-986fd",
  storageBucket: "chronus-986fd.firebasestorage.app",
  messagingSenderId: "1000250438623",
  appId: "1:1000250438623:web:1e17d0ac5018ba83500a6a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);