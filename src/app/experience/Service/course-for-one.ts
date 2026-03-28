import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse, CourseInfo } from '../Models/course.model';

@Injectable({
  providedIn: 'root',
})
//========!!這是Service!!================//

export class CourseForOne {
  constructor(private http: HttpClient) { }

  // 取得特定課程資訊
  getCourseInfo(sessionId: number): Observable<APIResponse<CourseInfo>> {
    // 這裡使用反引號 `` 來組合字串，方便帶入變數
    return this.http.get<APIResponse<CourseInfo>>(`${environment.apiUrl}/api/Exp/Exp/CourseInfo${sessionId}`);
  }
}
