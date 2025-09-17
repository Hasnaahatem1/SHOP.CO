import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IProduct } from '../../../Model/i-product';

@Injectable({
  providedIn: 'root'
})
export class CartServicesService {
  private storageKey = 'cart';   // المفتاح لتخزين الكارت
  private cartSubject: BehaviorSubject<IProduct[]> = new BehaviorSubject<IProduct[]>([]);

  constructor() {
    const savedCart = localStorage.getItem(this.storageKey);
    this.cartSubject = new BehaviorSubject<IProduct[]>(savedCart ? JSON.parse(savedCart) : []);
  }

  // تخزين في LocalStorage
  private saveToStorage(cart: IProduct[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  // استرجاع الكارت كـ Observable
  getCart(): Observable<IProduct[]> {
    return this.cartSubject.asObservable();
  }

  // إضافة منتج للكارت مع كمية
  addToCart(product: IProduct, quantity: number = 1) {
    const current = [...this.cartSubject.value];
    const existingIndex = current.findIndex(p => p.id === product.id);

    if (existingIndex > -1) {
      // لو المنتج موجود، نزود الكمية
      current[existingIndex].quantity = (current[existingIndex].quantity || 1) + quantity;
    } else {
      // المنتج جديد، نضيفه بالكمية
      current.push({ ...product, quantity });
    }

    this.cartSubject.next(current);
    this.saveToStorage(current);
  }

  // إزالة منتج حسب index
  removeFromCart(index: number) {
    const arr = [...this.cartSubject.value];
    arr.splice(index, 1);
    this.cartSubject.next(arr);
    this.saveToStorage(arr);
  }

  // مسح الكارت بالكامل
  clearCart() {
    this.cartSubject.next([]);
    localStorage.removeItem(this.storageKey);
  }

  // حساب إجمالي السعر
  getTotal(): Observable<number> {
    return this.cartSubject.asObservable().pipe(
      map(items => items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0))
    );
  }

  // حساب إجمالي عدد العناصر
  getCount(): Observable<number> {
    return this.cartSubject.asObservable().pipe(
      map(items => items.reduce((count, it) => count + (it.quantity || 1), 0))
    );
  }

  // زيادة الكمية حسب index
  increaseQty(index: number) {
    const cart = [...this.cartSubject.value];
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    this.cartSubject.next(cart);
    this.saveToStorage(cart);
  }

  // تقليل الكمية حسب index
  decreaseQty(index: number) {
    const cart = [...this.cartSubject.value];
    if ((cart[index].quantity || 1) > 1) {
      cart[index].quantity!--;
      this.cartSubject.next(cart);
      this.saveToStorage(cart);
    }
  }
  cart$ = this.cartSubject.asObservable();
  getCartCount() {
    return this.cartSubject.value.length;
  }
}
