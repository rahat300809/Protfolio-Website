import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCx2B7dIMleM39S1vcNgfA4mEMVbMDxDgo",
  authDomain: "protfolio3.firebaseapp.com",
  projectId: "protfolio3",
  storageBucket: "protfolio3.firebasestorage.app",
  messagingSenderId: "509831505615",
  appId: "1:509831505615:web:cf069de4241cf532e439ba",
  measurementId: "G-EEPW67SB7X"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
