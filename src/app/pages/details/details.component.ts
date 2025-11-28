import { Component, OnInit } from '@angular/core';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../Model/i-product';
import { FormsModule } from '@angular/forms';
import { IReview } from '../../Model/ireview';
import { CartServicesService } from '../../core/services/cart/cart-services.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  product: IProduct | null = null; // Use null for safer checks
  selectedColor: string = 'red';
  selectedSize: string = 'M';
  quantity: number = 1;

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

  constructor(
    private productService: ProductApiServicesService,
    private route: ActivatedRoute,
    private cartService: CartServicesService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id === null) {
      console.error('Product ID not found in URL');
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (data: IProduct | undefined) => {
        if (data) {
          this.product = data;
        } else {
          console.error('Product not found');
        }
      },
      error: (err) => console.error('Error fetching product:', err)
    });
  }

  // Split reviews into chunks
  chunkReviews(arr: IReview[], chunkSize: number): IReview[][] {
    const chunks: IReview[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  addToCart(quantity: number = 1) {
    if (!this.product) {
      alert('Product not loaded yet!');
      return;
    }
    this.cartService.addToCart(this.product, quantity);
  }
}
