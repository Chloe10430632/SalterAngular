import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse, CourseInfoI } from '../Interfaces/course.model';

@Injectable({
  providedIn: 'root',
})
//========!!這是Service!!================//

export class CourseForOneS {
  constructor(private client: HttpClient) { }

  // 取得特定課程資訊
  getSessionInfo(sessionId: number): Observable<APIResponse<CourseInfoI>> {
    // 這裡使用反引號 `` 來組合字串，方便帶入變數
    return this.client.get<APIResponse<CourseInfoI>>(`${environment.apiUrl}/api/Exp/Exp/CourseInfo${sessionId}`);
  }

}
