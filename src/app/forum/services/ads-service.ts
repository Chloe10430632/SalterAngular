import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdData } from '../interfaces/AdData';
import { map, timer, zip } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdsService {

  constructor(private http: HttpClient) { }

  //GET 廣告
  GetAdsApi() {
    const apiData$ = this.http.get<AdData>(`${environment.apiUrl}/Forum/Ads`);
    const minimumDelay$ = timer(700);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }



}
