import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdsService {






  constructor(private http: HttpClient) { }

  //GET 廣告
  GetAdsApi() {
    // return this.http.get<adData>('https://localhost:7017/api/Forum/Ads');
  }



}
