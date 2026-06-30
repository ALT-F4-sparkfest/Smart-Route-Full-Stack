import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGTwYHHNBcsykTat5WZ2NpZPk_d5tEsYI",
  authDomain: "smart-route-131ab.firebaseapp.com",
  projectId: "smart-route-131ab",
  storageBucket: "smart-route-131ab.firebasestorage.app",
  messagingSenderId: "576094018822",
  appId: "1:576094018822:web:1e50ed33593d67eff85287",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
