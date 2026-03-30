import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse, CoachAllInfoI } from '../Interfaces/coachallinfo';
import { environment } from '../../../environments/environment';
//========!!這是Service!!================//
//====找收藏清單====//
@Injectable({
  providedIn: 'root',
})
export class MemFavListS {
  constructor(private client: HttpClient) { }

  getFavList(page: number = 1): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.get<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/myFavList?page=${page}`);
  }
}
