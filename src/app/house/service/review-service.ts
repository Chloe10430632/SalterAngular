import { Injectable } from '@angular/core';
import { ICreateReview } from '../interface/icreate-review';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }



  addReview(dto: ICreateReview): Observable<any> {
    // 注意：這裡的路徑要對應 [HttpPost("reviews")]
    return this.http.post(`${this.apiUrl}/Home/reviews`, dto);
  }

}
