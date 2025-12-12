import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { FirebaseService } from '../../core/services/firebase-service.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: any[] = [];
  subtotal: number = 0;
  discount: number = 0;
  deliveryFee = 15; // ثابت
  total: number = 0;

  customer = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };

  paymentMethod: string = '';
  errors: any = {};

  constructor(
    private cartService: CartServicesService,
    private firebase: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // ربط الكارت
    this.cartService.getCart().subscribe(items => this.cartItems = items);

    // إجمالي السعر بدون خصم
    this.cartService.getTotal().subscribe(sub => this.subtotal = sub);

    // لو عندك خصم أو promoPercent$
    // احنا دلوقتي نضيف مثال خصم 20% إذا حبيت
    const promoPercent = 0; // 0.2 يعني 20%
    combineLatest([this.cartService.getTotal()]).pipe(
      map(([sub]) => {
        this.discount = +(sub * promoPercent).toFixed(2);
        this.total = +(sub - this.discount + this.deliveryFee).toFixed(2);
      })
    ).subscribe();
  }

  async placeOrder() {
    this.errors = {};

    if (!this.customer.name) this.errors.name = "Full name is required";
    if (!this.customer.email) this.errors.email = "Email is required";
    if (!this.customer.phone) this.errors.phone = "Phone number is required";
    if (!this.customer.address) this.errors.address = "Address is required";
    if (!this.customer.city) this.errors.city = "City is required";
    if (!this.paymentMethod) this.errors.paymentMethod = "Select a payment method";
    if (this.cartItems.length === 0) this.errors.cart = "Your cart is empty.";

    if (Object.keys(this.errors).length > 0) return;

    const orderData = {
      customer: this.customer,
      items: this.cartItems,
      subtotal: this.subtotal,
      discount: this.discount,
      deliveryFee: this.deliveryFee,
      total: this.total,
      paymentMethod: this.paymentMethod,
      createdAt: new Date(),
      status: 'pending'
    };

    try {
      await this.firebase.createOrder(orderData);
      alert("Order placed successfully!");
      this.cartService.clearCart();
      this.router.navigate(['/']); // Navigate to home
    } catch (error) {
      console.error('Order error', error);
      alert('Failed to place order. Please try again.');
    }
  }

}
