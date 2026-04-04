import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../Interfaces/IIcoachAllinfo';
import { ReviewI } from '../Interfaces/IIreview';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewsS {
  constructor(private client: HttpClient) { }
  /**拿評論 */
  getReviews(coachId: number): Observable<APIResponse<ReviewI[]>> {
    return this.client.get<APIResponse<ReviewI[]>>(`${environment.apiUrl}/Exp/Exp/ContentDetails/${coachId}`)
  }
  /**拿最新三則評論 */
  getThreeReviews(coachId: number): Observable<APIResponse<ReviewI[]>> {
    return this.client.get<APIResponse<ReviewI[]>>(`${environment.apiUrl}/Exp/Exp//ThreeReviews/${coachId}`)
  }
  /**新增評論 */
  addReview(data: any): Observable<APIResponse<ReviewI>> {
    return this.client.post<APIResponse<ReviewI>>(`${environment.apiUrl}/Exp/Exp/AddReview`, data)
  }
  /**改評論 */
  editReview(reviewId: number, data: any): Observable<APIResponse<ReviewI>> {
    return this.client.put<APIResponse<ReviewI>>(`${environment.apiUrl}/Exp/Exp/EditReview/${reviewId}`, data)
  }

  /**刪除評論 */
  deleteReview(reviewId: number): Observable<APIResponse<ReviewI>> {
    return this.client.delete<APIResponse<ReviewI>>(`${environment.apiUrl}/Exp/Exp/DeleteReview/${reviewId}`)
  }

}
