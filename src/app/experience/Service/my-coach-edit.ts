import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

//===========!!Service!!================//

@Injectable({
  providedIn: 'root',
})
export class MyCoachEditS {
  constructor(private client: HttpClient) { }
  //===========================================//
  getOriginInfo(coachId: string) {
    return this.client.get<any>(`${environment.apiUrl}/Exp/Exp/Info/${coachId}`);
  }

  updateCoach(coachId: string, data: any) {
    return this.client.put(`${environment.apiUrl}/Exp/Exp/EditCoach/${coachId}`, data);
  }

  getSpecialityList() {
    return this.client.get<any>(`${environment.apiUrl}/Exp/Exp/Spe`);
  }
  //---------------------------//
  getCityList() {
    // 取得全台灣所有縣市
    return this.client.get<any[]>(`${environment.apiUrl}/trip/Trip/cities`);
  }

  getDistrictsByCity(cityId: number) {
    // 根據選中的縣市 ID，取得該縣市下的所有行政區
    return this.client.get<any[]>(`${environment.apiUrl}/trip/Trip/cities/${cityId}/districts`);
  }


}
// https://localhost:7017/api/trip/Trip/cities
//https://localhost:7017/api/trip/Trip/cities/{cityId}/districts
