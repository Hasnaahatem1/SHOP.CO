import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { IReview } from '../../Model/ireview';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { AuthService } from '../../core/services/auth/userauth.service';
import { FirebaseService } from '../../core/services/firebase-service.service';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css'] // ✅ مصفوفة
})
export class NewArrivalsComponent implements OnInit {
  products: IProduct[] = [];
  reviews: IReview[] = [
    { name: 'Sarah M.', text: "...", rating: 5 },
    { name: 'Alex K.', text: "...", rating: 5 },
    { name: 'James L.', text: "...", rating: 5 },
    { name: 'Emily R.', text: "...", rating: 4 },
    { name: 'Michael B.', text: "...", rating: 4 },
    { name: 'Olivia S.', text: "...", rating: 5 },
    { name: 'David K.', text: "Quick delivery and good packaging.", rating: 4 },
    { name: 'Linda T.', text: "...", rating: 5 },
    { name: 'Robert W.', text: "Great customer support and quality products.", rating: 4 },
    { name: 'Sophia P.', text: "...", rating: 5 }
  ];

  searchTerm: string = '';
  selectedCategories: string[] = [];
  categories: string[] = ['Men', 'Women'];

  constructor(
    private productService: ProductApiServicesService,
    private router: Router,
    private cartService: CartServicesService,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: IProduct[]) => this.products = data,
      error: (err: any) => console.error('Error fetching products:', err)
    });
  }

  chunkReviews(arr: IReview[], chunkSize: number): IReview[][] {
    const chunks: IReview[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  getFilteredProducts(): IProduct[] {
    return this.products.filter(p => 
      p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedCategories.length === 0 || this.selectedCategories.includes(p.category))
    );
  }

  onCategoryChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== value);
    }
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
