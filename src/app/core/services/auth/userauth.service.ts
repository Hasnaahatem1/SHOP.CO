import { Injectable } from '@angular/core';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { auth, db } from '../../../firebase-config'; // Import centralized instances

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // Monitor auth state changes uses the imported 'auth' instance directly
    auth.onAuthStateChanged((user: User | null) => {
      this.currentUser.next(user);
    });
  }

  // Register a new user
  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
      const result = await signInWithPopup(auth, provider);
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
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Facebook login error:', error);
      return { success: false, message: 'Facebook login failed' };
    }
  }

  // Logout user
  async logout() {
    await signOut(auth);
    this.currentUser.next(null);
    this.isAdmin.next(false);
  }

  loginAsAdmin(code: string): boolean {
    if (code === 'Admin') {
      this.isAdmin.next(true);
      return true;
    }
    return false;
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
