import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../Interfaces/coachallinfo';
import { SessionInfoI } from '../Interfaces/session-ifo';
import { Observable } from 'rxjs';

//===========!!Service!!================//

@Injectable({
  providedIn: 'root',
})
export class SessionDisplayS {
  constructor(private client: HttpClient) { }

  getTimeInfo(sessionId: number) {
    return this.client.get<APIResponse<SessionInfoI>>(`${environment.apiUrl}/Exp/Exp/CourseInfo/${sessionId}`);
  }
  getAllTimeSession(): Observable<APIResponse<SessionInfoI[]>> {
    return this.client.get<APIResponse<SessionInfoI[]>>(`${environment.apiUrl}/Sessions`);
  }
}
