import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse, CoachAllInfoI } from '../Interfaces/coachallinfo';
import { FavI } from '../Interfaces/myfav';
import { ReviewI } from '../Interfaces/reviewI';

//===========!!Service!!================//

@Injectable({
  providedIn: 'root',
})
export class CoachAllInfoS {
  constructor(private client: HttpClient) { }

  getCoachInfo(coachId: number): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.get<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/Info/${coachId}`);
  }

  changeFav(data: FavI): Observable<FavI> {
    return this.client.post<FavI>(`${environment.apiUrl}/Exp/Exp/Favorites`, data)
  }
  HeartIds(): Observable<any> {
    return this.client.get<any>(`${environment.apiUrl}/Exp/Exp/FavHeart`);
  }

  goToReview(coachId: number): Observable<APIResponse<ReviewI>> {
    return this.client.get<APIResponse<ReviewI>>(`${environment.apiUrl}/Exp/Exp/ContentDetails/${coachId}`);
  }

}
