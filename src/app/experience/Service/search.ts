import { CoachAllInfoI } from './../Interfaces/coachallinfo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

//==================!!Service!!======================//

@Injectable({
  providedIn: 'root',
})
export class SearchS {
  constructor(private client: HttpClient) {
  }
  multiSearch(keyword: string): Observable<CoachAllInfoI[]> {

    const api1 = this.client.get<{ issuccess: boolean, data: CoachAllInfoI[] }>(`${environment.apiUrl}/Exp/Exp/NameSearch?key=${keyword}`);
    const api2 = this.client.get<{ issuccess: boolean, data: CoachAllInfoI[] }>(`${environment.apiUrl}/Exp/Exp/SpeSearch?key=${keyword}`);
    const api3 = this.client.get<{ issuccess: boolean, data: CoachAllInfoI[] }>(`${environment.apiUrl}/Exp/Exp/DistSearch?key=${keyword}`);

    return forkJoin([api1, api2, api3]).pipe(
      map(([res1, res2, res3]) => {
        const combined = [
          ...(res1?.data || []),
          ...(res2?.data || []),
          ...(res3?.data || [])
        ];
        const unique = combined.filter((coach, index, self) =>
          index === self.findIndex((t) => t.coachId === coach.coachId)
        );
        return unique;
      })

    );
  }
}
// https://localhost:7017/api/Exp/Exp/NameSearch

// https://localhost:7017/api/Exp/Exp/SpeSearch

// https://localhost:7017/api/Exp/Exp/DistSearch
