import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdData } from '../interfaces/AdData';
import { map, timer, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdsService {






  constructor(private http: HttpClient) { }

  //GET 廣告
  GetAdsApi() {
    const apiData$ = this.http.get<AdData>('https://localhost:7017/api/Forum/Ads');
    const minimumDelay$ = timer(700);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }



}
