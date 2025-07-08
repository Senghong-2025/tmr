import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAagApPRlJt93yoZCqimncOev-ULUEOMPQ",
  authDomain: "tukdak.firebaseapp.com",
  projectId: "tukdak",
  storageBucket: "tukdak.firebasestorage.app",
  messagingSenderId: "1007943982228",
  appId: "1:1007943982228:web:433b45145789c73fd46881",
  measurementId: "G-ZB99XBKTPT"
};


// Initialize Firebase once
const app = initializeApp(firebaseConfig)

// Init services
const auth = getAuth(app)
const db = getFirestore(app)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      auth,
      db
    }
  }
})