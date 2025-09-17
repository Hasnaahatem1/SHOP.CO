import { Component } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { IReview } from '../../Model/ireview';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartServicesService } from '../../core/services/cart/cart-services.service';

@Component({
  selector: 'app-topselling',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './topselling.component.html',
  styleUrl: './topselling.component.css'
})
export class TopsellingComponent {
products:IProduct[]=[];
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
      
      constructor(private _ProductApiServicesService:ProductApiServicesService,private _route:Router,
        private cartService:CartServicesService
      ){}
        
      ngOnInit(): void {
      this._ProductApiServicesService.getAllProducts().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;
      },
      error: (err:any) => {
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
searchTerm: string = '';
selectedCategories: string[] = [];
categories: string[] = ['Men', 'Women']; // مثال على التصنيفات

filteredProducts(): IProduct[] {
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
gotoProductDetails(id:number){
        this._route.navigate(['details', id]);
}
 addToCart(product: IProduct) {
    this.cartService.addToCart(product);
  }
}
