import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse, CoachAllInfoI } from '../Interfaces/IIcoachAllinfo';
import { FavI } from '../Interfaces/IImyfav';
import { ReviewI } from '../Interfaces/IIreview';

//===========!!Service!!================//
//=====卡片其他資訊=====//

@Injectable({
  providedIn: 'root',
})
export class CoachCardInfoS {
  constructor(private client: HttpClient) { }
  //===========================================//


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
