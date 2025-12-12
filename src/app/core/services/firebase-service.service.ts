import { Injectable } from '@angular/core';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

  constructor() { }


  logEvent(userId: string, type: string, data: any) {
    return addDoc(collection(db, 'events'), {
      userId,
      type,
      data,
      createdAt: new Date()
    });
  }
  addSubscriber(email: string) {
    return addDoc(collection(db, 'subscribers'), {
      email: email,
      createdAt: new Date()
    });
  }
  createOrder(orderData: any) {
    return addDoc(collection(db, 'orders'), orderData);
  }


}
