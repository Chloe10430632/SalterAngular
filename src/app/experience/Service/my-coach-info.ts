import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse, CoachAllInfoI } from '../Interfaces/coachallinfo';
import { environment } from '../../../environments/environment';

//===========!!Service!!================//

@Injectable({
  providedIn: 'root',
})
export class MyCoachInfoS {
  constructor(private client: HttpClient) { }
  //===========================================//
  getMyInfo(coachId: number): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.get<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/Info/${coachId}`);
  }
  editMyInfo(coachId: number, data: CoachAllInfoI): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.post<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/EditCoach/${coachId}`, data);
  }

  createMyInfo(data: any): Observable<any> {
    return this.client.post<any>(`${environment.apiUrl}/Exp/Exp/BecomeCoach`, data);
  }

}
