import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../../Model/i-product';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductApiServicesService {
  private UrlApi = 'assets/products.json';

  constructor(private http: HttpClient) {}

  // كل المنتجات
  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.UrlApi);
  }

  // منتج واحد بالتفاصيل
  getProductById(id: number): Observable<IProduct | undefined> {
    return this.http.get<IProduct[]>(this.UrlApi).pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
