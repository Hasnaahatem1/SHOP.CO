import { Component, OnInit } from '@angular/core';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { IProduct } from '../../Model/i-product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { HeaderComponent } from '../../shared/Components/header/header.component';
import { AuthService } from '../../core/services/auth/userauth.service';
import { FirebaseService } from '../../core/services/firebase-service.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  filterProducts: IProduct[] = [];
  selectedCategory = '';
  priceRange: number = 500;
  sortBy: string = "popular";
  categories = ["T-shirts", "Shirts", "Jeans", "Shorts", "Hoodies", "Dress", "Gold", "Casual", "Leather"];
  searchTerm: string = '';
  isAdmin: boolean = false;

  constructor(
    private productService: ProductApiServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartServicesService,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    // Subscribe to admin status
    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.productService.getAllProducts().subscribe({
      next: (data: IProduct[]) => {
        console.log('Fetched products:', data);
        this.products = data.map(p => ({
          ...p,
          localCategory: this.getCategoryFromTitle(p.title)
        }));
        this.filterProducts = this.products;

        // Combine params and queryParams subscriptions or just handle them
        this.route.params.subscribe(params => {
          this.selectedCategory = params['category'] || '';
          this.applyFilter();
        });

        this.route.queryParams.subscribe(params => {
          this.searchTerm = params['search'] || '';
          this.applyFilter();
        });
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
        alert(`Error fetching products: ${err}`);
      }
    });
  }

  getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('t-shirt')) return 'T-shirts';
    if (lowerTitle.includes('shirt')) return 'Shirts';
    if (lowerTitle.includes('jeans')) return 'Jeans';
    if (lowerTitle.includes('short')) return 'Shorts';
    if (lowerTitle.includes('hoodie')) return 'Hoodies';
    if (lowerTitle.includes('dress')) return 'Dress';
    if (lowerTitle.includes('gold')) return 'Gold';
    if (lowerTitle.includes('casual')) return 'Casual';
    if (lowerTitle.includes('leather')) return 'Leather';
    return 'Others';
  }

  filterByCategory(cat: string) { this.selectedCategory = cat; this.applyFilter(); }
  filterBySize(size: number) {
    this.filterProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategory ? p.localCategory === this.selectedCategory : true;
      const matchPrice = p.price <= this.priceRange;
      const matchSize = p['size'] ? p['size'] === size : true;
      const matchSearch = this.searchTerm ? p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      return matchCategory && matchPrice && matchSize && matchSearch;
    });
    this.applySorting();
  }
  applyFilter() {
    this.filterProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategory ? p.localCategory === this.selectedCategory : true;
      const matchPrice = p.price <= this.priceRange;
      const matchSearch = this.searchTerm ? p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      return matchCategory && matchPrice && matchSearch;
    });
    this.applySorting();
  }
  applySorting() {
    if (this.sortBy === "low") this.filterProducts.sort((a, b) => a.price - b.price);
    else if (this.sortBy === "high") this.filterProducts.sort((a, b) => b.price - a.price);
    else this.filterProducts = [...this.filterProducts];
  }
  gotoProductDetails(id: number) { this.router.navigate(['details', id]); }

  // إضافة المنتج للسلة + تسجيل حدث Firebase
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

  addNewProduct() {
    this.router.navigate(['/add-product']);
  }

  deleteProduct(id: number | string, event: Event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(id.toString()).then(() => {
        this.products = this.products.filter(p => p.id !== id);
        this.applyFilter(); // Update view
        alert("Product deleted successfully");
      }).catch(err => {
        console.error("Error deleting product", err);
        alert("Error deleting product");
      });
    }
  }
}
