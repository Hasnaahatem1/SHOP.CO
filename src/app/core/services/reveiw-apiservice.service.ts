import { Injectable } from '@angular/core';
import { IReview } from '../../Model/ireview';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewAPIService {

  private reviewUrl = "assets/Review.json"; 

  constructor(private http: HttpClient) { }

  getAllReview(): Observable<IReview[]> {
    return this.http.get<IReview[]>(this.reviewUrl);
  }
  getReviewById(id:number):Observable<IReview>{
    return this.http.get<IReview>(`${this.reviewUrl}/${id}`);
  }

}
