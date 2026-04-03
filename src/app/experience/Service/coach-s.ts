import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SpecI } from '../Interfaces/IISpecSport';
import { CityI, DistI } from '../Interfaces/IIDistrict';
import { Observable } from 'rxjs';
import { APIResponse, CoachAllInfoI, CoachEditInfoI } from '../Interfaces/IIcoachAllinfo';

//===========!!Service!!================//
//教練、專業、地區//

@Injectable({
  providedIn: 'root',
})
export class CoachS {
  constructor(private client: HttpClient) { }
  //===========================================//
  getCoachInfoStr(coachId: string): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.get<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/Info/${coachId}`);
  }
  getCoachInfoNum(coachId: number): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.get<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/Info/${coachId}`);
  }
  getMyOwnInfo(): Observable<APIResponse<CoachAllInfoI>> {
    return this.client.get<APIResponse<CoachAllInfoI>>(`${environment.apiUrl}/Exp/Exp/MyInfo`);
  }
  editMyInfo(coachId: string, data: FormData): Observable<any> {
    return this.client.put<any>(`${environment.apiUrl}/Exp/Exp/EditCoach/${coachId}`, data);
  }

  createMyInfo(data: FormData): Observable<any> {
    return this.client.post<any>(`${environment.apiUrl}/Exp/Exp/BecomeCoach`, data);
  }
  //-------------------------------------//
  getSpecialityList() {
    return this.client.get<SpecI[]>(`${environment.apiUrl}/Exp/Exp/Spe`);
  }
  //---------------------------//
  getCityList() {
    // 取得全台灣所有縣市
    return this.client.get<DistI[]>(`${environment.apiUrl}/trip/Trip/cities`);
  }

  getDistrictsByCity(cityId: number) {
    // 根據選中的縣市 ID，取得該縣市下的所有行政區
    return this.client.get<CityI[]>(`${environment.apiUrl}/trip/Trip/cities/${cityId}/districts`);

  }

}
//---------------------------//



// https://localhost:7017/api/trip/Trip/cities
//https://localhost:7017/api/trip/Trip/cities/{cityId}/districts
