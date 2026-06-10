import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRalCf85TZ2fiLR9Qt6jzfGFCPtw-yP-c",
  authDomain: "foodsense-c426d.firebaseapp.com",
  projectId: "foodsense-c426d",
  storageBucket: "foodsense-c426d.firebasestorage.app",
  messagingSenderId: "456940297073",
  appId: "1:456940297073:web:01d91bef7aa4090ec774d0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
