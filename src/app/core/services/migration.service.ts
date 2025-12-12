import { Injectable } from '@angular/core';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MigrationService {

    constructor(private http: HttpClient) { }

    async migrateProducts() {
        try {
            // Fetch local products
            const products: any[] = await firstValueFrom(this.http.get<any[]>('assets/products.json'));

            const batch = writeBatch(db);
            const collectionRef = collection(db, 'products');

            products.forEach(product => {
                // Use product.id as the document ID to ensure consistency
                const docRef = doc(collectionRef, product.id.toString());
                // Clean up data if necessary
                const productData = {
                    ...product,
                    price: Number(product.price), // Ensure price is number
                    rating: product.rating || { rate: 0, count: 0 }
                };
                batch.set(docRef, productData);
            });

            await batch.commit();
            console.log('Migration completed successfully');
            alert('Migration completed! Products uploaded to Firestore.');
        } catch (error) {
            console.error('Migration failed', error);
            alert('Migration failed. Check console.');
        }
    }
}
