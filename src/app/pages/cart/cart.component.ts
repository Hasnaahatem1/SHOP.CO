import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { IProduct } from '../../Model/i-product';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  constructor(private cartService: CartServicesService,private router:Router) {
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

  // إضافة/نقص كمية (يفترض أن service عندها هذان الميتودان)
  increaseQty(index: number) {
    this.cartService.increaseQty(index);
  }

  decreaseQty(index: number) {
    this.cartService.decreaseQty(index);
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
    // لو حبيت تلغي البرومو عند تفريغ الكارت مثلاً:
    this.resetPromoIfEmpty();
  }

  clearCart() {
    this.router.navigateByUrl('/checkout');
    this.cartService.clearCart();
    // بعد التفريغ ننظف الكوبون
    this.promoPercent$.next(0);
    this.promoCode = '';
    this.promoMessage = null;
  }

  // يطبق البرومو كود
  applyPromo() {
    const code = (this.promoCode || '').trim();
    if (!code) {
      this.promoMessage = 'Please enter a promo code.';
      this.promoPercent$.next(0);
      return;
    }

    // هنا نتحقق من الكود المطلوب
    if (code.toLowerCase() === 'has2025') {
      // خصم 20%
      this.promoPercent$.next(0.20);
      this.promoMessage = 'Promo applied — 20% discount ✔️';
    } else {
      this.promoPercent$.next(0);
      this.promoMessage = 'Invalid promo code ❌';
    }
  }

  // لو الكارت بقى فاضي نلغي البرومو (اختياري)
  private resetPromoIfEmpty() {
    this.cart$.subscribe(cart => {
      if (!cart || cart.length === 0) {
        this.promoPercent$.next(0);
        this.promoCode = '';
        this.promoMessage = null;
      }
    }).unsubscribe();
  }

}
