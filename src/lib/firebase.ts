import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBRi9CxDN2EbT7jHRqq4FurVyNJ4evH2ew",
  authDomain: "stampify-48c7d.firebaseapp.com",
  projectId: "stampify-48c7d",
  storageBucket: "stampify-48c7d.firebasestorage.app",
  messagingSenderId: "940149803625",
  appId: "1:940149803625:web:ad184970c7849f57a170f8",
  measurementId: "G-DJJR8BM8KT"
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, auth, db, storage, analytics }; 