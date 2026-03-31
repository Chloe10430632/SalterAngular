import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, timer, zip } from 'rxjs';
import { environment } from './../../../environments/environment';
import { AdDetails } from '../interfaces/AdDetails';


@Injectable({
  providedIn: 'root',
})
export class AdsService {

  constructor(private http: HttpClient) { }

  /**GET 廣告 */
  GetAdsApi() {
    const apiData$ = this.http.get<AdDetails>(`${environment.apiUrl}/Forum/Ads`);
    const minimumDelay$ = timer(700);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

}
