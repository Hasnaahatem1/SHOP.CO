import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductApiServicesService } from '../../core/services/product-api-services.service';
import { IProduct } from '../../Model/i-product';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
    newProduct: any = { // Using any temporarily to allow flexibility with id
        title: '',
        price: 0,
        description: '',
        category: 'Casual',
        image: '',
        rating: { rate: 0, count: 0 }
    };

    categories = ["T-shirts", "Shirts", "Jeans", "Shorts", "Hoodies", "Dress", "Gold", "Casual", "Leather"];

    constructor(
        private productService: ProductApiServicesService,
        private router: Router
    ) { }

    onSubmit() {
        if (this.newProduct.title && this.newProduct.price) {
            this.productService.addProduct(this.newProduct).then(() => {
                alert('Product added successfully!');
                this.router.navigate(['/product']);
            }).catch(err => {
                console.error('Error adding product:', err);
                alert('Error adding product.');
            });
        } else {
            alert('Please fill in at least Title and Price.');
        }
    }

    cancel() {
        this.router.navigate(['/product']);
    }
}
