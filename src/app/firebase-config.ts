import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAFLApQ_ukuvUzSuwQd2FxYpFzTyXk6QNw",
  authDomain: "ecommerce-shop-2d11a.firebaseapp.com",
  projectId: "ecommerce-shop-2d11a",
  storageBucket: "ecommerce-shop-2d11a.firebasestorage.app",
  messagingSenderId: "453118184018",
  appId: "1:453118184018:web:f9dd433575ab87bc322d8b",
  measurementId: "G-9M793GQHF4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
