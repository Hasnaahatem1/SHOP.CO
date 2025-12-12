import { Injectable } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { Observable, from, map, catchError, of, switchMap, forkJoin } from 'rxjs';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductApiServicesService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<IProduct[]> {
    const productsRef = collection(db, 'products');

    const firestoreProducts$ = from(getDocs(productsRef)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({ id: Number(doc.id) || doc.id, ...doc.data() } as any));
      }),
      catchError((error) => {
        console.warn('Error fetching from Firestore:', error);
        return of([] as IProduct[]);
      })
    );

    const localProducts$ = this.http.get<IProduct[]>('assets/products.json').pipe(
      map(products => products.map(p => ({ ...p, id: Number(p.id) || p.id }))),
      catchError((error) => {
        console.warn('Error fetching local JSON:', error);
        return of([] as IProduct[]);
      })
    );

    return forkJoin([localProducts$, firestoreProducts$]).pipe(
      map(([local, firestore]) => {
        // Merge arrays. If duplicates exist (same ID), we might want to prefer Firestore or just show both.
        // For now, simpler is better: concat them.
        return [...local, ...firestore];
      })
    );
  }

  getProductById(id: number | string): Observable<IProduct | undefined> {
    const docRef = doc(db, 'products', id.toString());
    return from(getDoc(docRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          return of({ id: Number(docSnap.id) || docSnap.id, ...docSnap.data() } as any);
        } else {
          // If not found in Firestore, try local JSON
          return this.http.get<IProduct[]>('assets/products.json').pipe(
            map(products => products.find(p => p.id == id))
          );
        }
      }),
      catchError(() => {
        // Fallback for details could be implemented here too, but start with list
        return this.http.get<IProduct[]>('assets/products.json').pipe(
          map(products => products.find(p => p.id == id))
        );
      })
    );
  }

  addProduct(product: any) {
    const productsRef = collection(db, 'products');
    return addDoc(productsRef, product);
  }

  deleteProduct(id: string) {
    const docRef = doc(db, 'products', id);
    return deleteDoc(docRef);
  }
}
