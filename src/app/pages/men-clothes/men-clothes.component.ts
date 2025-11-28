import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { AuthService } from '../../core/services/auth/userauth.service';

@Component({
  selector: 'app-men-clothes',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './men-clothes.component.html',
  styleUrls: ['./men-clothes.component.css']
})
export class MenClothesComponent implements OnInit {

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  category = "men's clothing";   

  constructor(
    private productService: ProductApiServicesService,
    private router: Router,
    private cartService: CartServicesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;
        this.filterProducts(); // Filter immediately
      },
      error: (err: any) => {
        alert(`Error fetching products: ${err}`);
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(
      p => p.category === this.category
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
  }
}
