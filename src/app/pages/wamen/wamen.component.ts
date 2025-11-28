import { Component } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { AuthService } from '../../core/services/auth/userauth.service';
import { FirebaseService } from '../../core/services/firebase-service.service';
@Component({
  selector: 'app-wamen',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './wamen.component.html',
  styleUrl: './wamen.component.css'
})
export class WamenComponent {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];   // ✅ خلي الاسم كده
  Category = "women's clothing";   // 👈 دي الكاتيجوري اللي الصفحة دي بتعرضها

  constructor(
    private productService: ProductApiServicesService,
    private router: Router,
    private cartService: CartServicesService,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;
        this.filterProducts() // 👈 فلترة مباشرة
      },
      error: (err: any) => {
        alert(`Error fetching products: ${err}`);
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(
      p => p.category === this.Category
    );
  }

  gotoProductDetails(id: number) {
    this.router.navigate(['details', id]);
  }
 addToCart(product: IProduct) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('You must be logged in to add items to the cart.');
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product);
    this.firebaseService.logEvent(user.uid, 'add_to_cart', { productId: product.id });
  }
}
