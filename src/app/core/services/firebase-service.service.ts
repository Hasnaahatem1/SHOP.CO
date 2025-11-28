import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
export class FirebaseService {
  app: any;
  auth: any;
  db: any;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  // ✅ الميثود المهمة لتسجيل الأحداث
  logEvent(userId: string, type: string, data: any) {
    return addDoc(collection(this.db, 'events'), {
      userId,
      type,
      data,
      createdAt: new Date()
    });
  }
}
