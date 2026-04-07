import { APIResponse } from './../Interfaces/IICourse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CoachAllInfoI } from '../Interfaces/IIcoachAllinfo';

//這是Srvice//
//系統推薦//

@Injectable({
  providedIn: 'root',
})
export class RecommandS {
  constructor(private client: HttpClient) { }
  getRecommendCoaches(id: number): Observable<APIResponse<CoachAllInfoI[]>> {
    return this.client.get<APIResponse<CoachAllInfoI[]>>(`${environment.apiUrl}/Exp/Exp/Recommand/${id}`);
  }
}
