import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFLApQ_ukuvUzSuwQd2FxYpFzTyXk6QNw",
  authDomain: "ecommerce-shop-2d11a.firebaseapp.com",
  projectId: "ecommerce-shop-2d11a",
  storageBucket: "ecommerce-shop-2d11a.firebasestorage.app",
  messagingSenderId: "453118184018",
  appId: "1:453118184018:web:f9dd433575ab87bc322d8b",
  measurementId: "G-9M793GQHF4"
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth(initializeApp(firebaseConfig));
  private db = getFirestore();
  private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor() {
    // Monitor auth state changes
    this.auth.onAuthStateChanged((user: User | null) => {
      this.currentUser.next(user);
    });
  }

  // Register a new user
  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(this.db, 'users', user.uid), {
        email,
        name,
        createdAt: new Date()
      });

      return { success: true, user };
    } catch (error: any) {
      console.error('Firebase registration error:', error);
      let message = 'An error occurred during registration';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak';
      }
      return { success: false, message };
    }
  }

  // Login user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Firebase login error:', error);
      return { success: false, message: 'Incorrect email or password' };
    }
  }

  // Google Login
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Google login error:', error);
      return { success: false, message: 'Google login failed' };
    }
  }

  // Facebook Login
  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Facebook login error:', error);
      return { success: false, message: 'Facebook login failed' };
    }
  }

  // Logout user
  async logout() {
    await signOut(this.auth);
    this.currentUser.next(null);
  }

  // Get current user (synchronously)
  getCurrentUser() {
    return this.currentUser.value;
  }

  // Observable to track user state
  getCurrentUserObservable() {
    return this.currentUser.asObservable();
  }
}
