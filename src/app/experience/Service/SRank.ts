import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface rankItem {
  coachId: number;
  coachName: string;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
}


@Injectable({ providedIn: 'root' })

export class SRank {
  private apiUrl = 'https://localhost:7017/api/Exp/Exp/NewRank';

  constructor(private client: HttpClient) { }

  getNewRank(): Observable<any[]> {
    return this.client.get<any[]>(this.apiUrl)
  }
}
