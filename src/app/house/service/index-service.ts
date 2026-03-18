import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HouseListDTO } from '../interface/ihouse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class HouseService {
  private apiUrl = 'https://localhost:7017/api/Home'

  constructor(private http: HttpClient) {

  }

  // 取得所有房源清單
  getHouses(): Observable<HouseListDTO[]> {
    return this.http.get<HouseListDTO[]>(this.apiUrl);
  }

}
