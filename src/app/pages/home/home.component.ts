import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { CommonModule } from '@angular/common';
import { IReview } from '../../Model/ireview';
import { Router, RouterLink } from '@angular/router';
import { CartServicesService } from '../../core/services/cart/cart-services.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  reviews: IReview[] = [
    { name: 'Sarah M.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions", rating: 5 },
    { name: 'Alex K.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.", rating: 5 },
    { name: 'James L.', text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.", rating: 5 },
    { name: 'Emily R.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.", rating: 4 },
    { name: 'Michael B.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.", rating: 4 },
    { name: 'Olivia S.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.", rating: 5 },
    { name: 'David K.', text: "Quick delivery and good packaging.", rating: 4 },
    { name: 'Linda T.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions", rating: 5 },
    { name: 'Robert W.', text: "Great customer support and quality products.", rating: 4 },
    { name: 'Sophia P.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions", rating: 5 }
  ];

  products: IProduct[] = [];

  constructor(
    private _ProductApiServicesService: ProductApiServicesService,
    private _route: Router,
    private cartService: CartServicesService
  ) {}

  ngOnInit(): void {
    this._ProductApiServicesService.getAllProducts().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  chunkReviews(arr: IReview[], chunkSize: number): IReview[][] {
    const chunks: IReview[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  gotoProductDetails(id: number) {
    this._route.navigate(['details', id]);
  }

  gotoallproduct() {
    this._route.navigate(['product']);
  }
  
  gotoNewArrivals() {
    this._route.navigateByUrl(`newarrivals`);
  }

  gotoTopSelling() {
    this._route.navigateByUrl(`topselling`);
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart(product);
  }
}
