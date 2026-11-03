import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4_Y0rhyZo6e1DB89nvo-XfM3JRdFN1PM",
  authDomain: "ems-pro-dashboard.firebaseapp.com",
  projectId: "ems-pro-dashboard",
  storageBucket: "ems-pro-dashboard.firebasestorage.app",
  messagingSenderId: "316834038412",
  appId: "1:316834038412:web:acbc73e0bf0d3d136e31a9",
  measurementId: "G-7MVKWMDKB8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;