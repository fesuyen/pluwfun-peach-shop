import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// 您提供的 Google Firebase 金鑰
const firebaseConfig = {
  apiKey: "AIzaSyDpWEo4GEq2Zu65DoMeGt1pehqxw2V2ong",
  authDomain: "pluwfun-peach-shop.firebaseapp.com",
  projectId: "pluwfun-peach-shop",
  storageBucket: "pluwfun-peach-shop.firebasestorage.app",
  messagingSenderId: "661473381662",
  appId: "1:661473381662:web:3c86ca5c0b52d91cf69f8f",
  measurementId: "G-MSYSCWSBVF"
};

const app = initializeApp(firebaseConfig);

// 匯出 Firestore (存訂單用) 與 Realtime Database (存文字內容用)
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
