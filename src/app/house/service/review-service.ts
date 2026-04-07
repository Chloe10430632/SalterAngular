import { Injectable } from '@angular/core';
import { ICreateReview, IUpdateReview } from '../interface/icreate-review';
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

  updateReview(dto: IUpdateReview): Observable<any> {
    return this.http.put(`${this.apiUrl}/Home/updateReview`, dto)
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Home/delete/${reviewId}`)
  }

  //審核留言權限
  checkReviewPermission(userId: number, roomTypeId: number): Observable<{ canReview: boolean }> {
    return this.http.get<{ canReview: boolean }>(`${this.apiUrl}/Home/CheckPermission/${userId}/${roomTypeId}`);
  }

}
