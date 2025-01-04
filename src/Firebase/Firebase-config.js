import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAyKhca9D9Yl9AGEkGyPcGe4CiVnu5xvQ8",
  authDomain: "elxa-com.firebaseapp.com",
  projectId: "elxa-com",
  storageBucket: "elxa-com.firebasestorage.app",
  messagingSenderId: "533966388323",
  appId: "1:533966388323:web:1b1080f6962452e5890c56",
  measurementId: "G-78MB4LGQVY"
};



const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider()
export default app;