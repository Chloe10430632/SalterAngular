import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rank {
  constructor(private client: HttpClient) { }
  //===========================================//
  getPopRank(page: number = 1): Observable<any> {
    return this.client.get<any>(`${environment.apiUrl}/Exp/Exp/PopRank?page=${page}`);
  }
  getNewRank(page: number = 1): Observable<any> {
    return this.client.get<any>(`${environment.apiUrl}/Exp/Exp/NewRank?page=${page}`);
  }
}
