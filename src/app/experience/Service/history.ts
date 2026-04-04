import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CourseOrderI } from '../Interfaces/IIOrder';
import { APIResponse } from '../Interfaces/IICourse';
import { Observable } from 'rxjs';

//!!這是Servise!!//
//學習歷程用//

@Injectable({
  providedIn: 'root',
})
export class HistoryS {
  constructor(private client: HttpClient) { }

  getAttendHistory(): Observable<APIResponse<CourseOrderI[]>> {
    return this.client.get<APIResponse<CourseOrderI[]>>(`${environment.apiUrl}/Exp/Exp/AttendHistory`)
  }
}
