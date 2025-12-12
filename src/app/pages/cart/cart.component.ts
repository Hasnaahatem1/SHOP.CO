import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { IProduct } from '../../Model/i-product';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase-service.service';
import { AuthService } from './../../core/services/auth/userauth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart$: Observable<IProduct[]>;
  subtotal$: Observable<number>;
  discount$: Observable<number>;
  total$: Observable<number>;

  // Promo UI
  promoCode: string = '';
  promoMessage: string | null = null;
  private promoPercent$ = new BehaviorSubject<number>(0);

  deliveryFee = 15; // ثابت مثال

  constructor(
    private cartService: CartServicesService,
    private router: Router,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.cart$ = this.cartService.getCart();

    // subtotal (من service)
    this.subtotal$ = this.cartService.getTotal();

    // discount يعتمد على subtotal و promoPercent$
    this.discount$ = combineLatest([this.subtotal$, this.promoPercent$]).pipe(
      map(([subtotal, percent]) => +(subtotal * percent).toFixed(2))
    );

    // total = subtotal - discount + delivery
    this.total$ = combineLatest([this.subtotal$, this.discount$]).pipe(
      map(([subtotal, discount]) => +(subtotal - discount + this.deliveryFee).toFixed(2))
    );
  }

  // إعادة تعيين البرومو إذا الكارت فاضي
  private resetPromoIfEmpty() {
    this.cart$.pipe(take(1)).subscribe(cart => {
      if (!cart || cart.length === 0) {
        this.promoPercent$.next(0);
        this.promoCode = '';
        this.promoMessage = null;
      }
    });
  }

  // زيادة كمية
  increaseQty(index: number) {
    this.cart$.pipe(take(1)).subscribe(cart => {
      const product = cart[index];
      const user = this.authService.getCurrentUser();
      if (product && user) {
        this.cartService.increaseQty(index);
        this.firebaseService.logEvent(user.uid, 'increase_qty', { productId: product.id });
      }
    });
  }

  // نقص كمية
  decreaseQty(index: number) {
    this.cart$.pipe(take(1)).subscribe(cart => {
      const product = cart[index];
      const user = this.authService.getCurrentUser();
      if (product && user) {
        this.cartService.decreaseQty(index);
        this.firebaseService.logEvent(user.uid, 'decrease_qty', { productId: product.id });
      }
    });
  }

  // إزالة منتج
  removeItem(index: number) {
    this.cart$.pipe(take(1)).subscribe(cart => {
      const product = cart[index];
      const user = this.authService.getCurrentUser();
      if (product && user) {
        this.cartService.removeFromCart(index);
        this.firebaseService.logEvent(user.uid, 'remove_item', { productId: product.id });
      }
    });
    this.resetPromoIfEmpty();
  }

  // تفريغ الكارت
  clearCart() {
    this.cartService.clearCart();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.firebaseService.logEvent(user.uid, 'clear_cart', {});
    }
    this.promoPercent$.next(0);
    this.promoCode = '';
    this.promoMessage = null;
  }

  goToCheckout() {
    this.router.navigateByUrl('/checkout');
  }

  // تطبيق البرومو كود
  applyPromo() {
    const code = (this.promoCode || '').trim();
    const user = this.authService.getCurrentUser();
    if (!code) {
      this.promoMessage = 'Please enter a promo code.';
      this.promoPercent$.next(0);
      return;
    }

    if (code.toLowerCase() === 'has2025') {
      this.promoPercent$.next(0.20);
      this.promoMessage = 'Promo applied — 20% discount ✔️';
      if (user) this.firebaseService.logEvent(user.uid, 'apply_promo', { code });
    } else {
      this.promoPercent$.next(0);
      this.promoMessage = 'Invalid promo code ❌';
      if (user) this.firebaseService.logEvent(user.uid, 'apply_promo_failed', { code });
    }
  }
}
