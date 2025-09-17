import { Component, OnInit } from '@angular/core';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { IProduct } from '../../Model/i-product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { HeaderComponent } from '../../shared/Components/header/header.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule,HeaderComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  filterProducts: IProduct[] = [];
  selectedCategory = '';
  priceRange: number = 500;   // default max price
  sortBy: string = "popular";

  // الفئات اللي هتظهر في الفلتر
  categories = ["T-shirts", "Shirts", "Jeans", "Shorts", "Hoodies","Dress","Gold","Casual","Leather"];

  constructor(
    private _ProductApiServicesService: ProductApiServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartServicesService
  ) {}

  ngOnInit(): void {
    this._ProductApiServicesService.getAllProducts().subscribe({
      next: (data: IProduct[]) => {
        // أضف لكل منتج localCategory مبنية على العنوان
        this.products = data.map(p => ({
          ...p,
          localCategory: this.getCategoryFromTitle(p.title)
        }));

        this.filterProducts = this.products;

        // اسمع للـ Route Params
        this.route.params.subscribe(params => {
          this.selectedCategory = params['category'] || '';
          this.applyFilter();
        });
      },
      error: (err: any) => {
        alert(`Error fetching products: ${err}`);
      }
    });
  }

  // استخراج الكاتيجوري من اسم المنتج
  getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('t-shirt')) return 'T-shirts';
    if (lowerTitle.includes('shirt')) return 'Shirts';
    if (lowerTitle.includes('jeans')) return 'Jeans';
    if (lowerTitle.includes('short')) return 'Shorts';
    if (lowerTitle.includes('hoodie')) return 'Hoodies';
    if(lowerTitle.includes('dress')) return 'Dress';
    if(lowerTitle.includes('gold')) return 'Gold';
    if(lowerTitle.includes('casual')) return 'Casual';
    if(lowerTitle.includes('leather')) return 'Leather';
    return 'Others';
  }

  // فلترة حسب الكاتيجوري
  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  // فلترة حسب المقاس (لو عندك size)
  filterBySize(size: number) {
    this.filterProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategory ? p.localCategory === this.selectedCategory : true;
      const matchPrice = p.price <= this.priceRange;
      const matchSize = p['size'] ? p['size'] === size : true;
      return matchCategory && matchPrice && matchSize;
    });
    this.applySorting();
  }

  // تطبيق الفلاتر
  applyFilter() {
    this.filterProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategory ? p.localCategory === this.selectedCategory : true;
      const matchPrice = p.price <= this.priceRange;
      return matchCategory && matchPrice;
    });
    this.applySorting();
  }

  // ترتيب المنتجات
  applySorting() {
    if (this.sortBy === "low") {
      this.filterProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "high") {
      this.filterProducts.sort((a, b) => b.price - a.price);
    } else {
      this.filterProducts = [...this.filterProducts]; // default popular
    }
  }

  // التنقل لتفاصيل المنتج
  gotoProductDetails(id: number) {
    this.router.navigate(['details', id]);
  }

  // إضافة للسلة
  addToCart(product: IProduct) {
    this.cartService.addToCart(product);
  }
    searchTerm: string = '';

 
}
