import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';




const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app);

export const provider = new GoogleAuthProvider()
export default app;