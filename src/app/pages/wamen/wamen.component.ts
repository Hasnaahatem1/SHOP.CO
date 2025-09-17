import { Component } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../core/services/cart/cart-services.service';

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
    private _ProductApiServicesService: ProductApiServicesService,
    private route: Router,
    private cartService:CartServicesService
  ) {}

  ngOnInit(): void {
    this._ProductApiServicesService.getAllProducts().subscribe({
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
    this.route.navigate(['details', id]);
  }
  addToCart(product: IProduct) {
    this.cartService.addToCart(product);
  }
}
