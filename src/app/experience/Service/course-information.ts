import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CourseInfoI } from '../Interfaces/IICourse';
import { APIResponse } from '../Interfaces/IIcoachAllinfo';

@Injectable({
  providedIn: 'root',
})
//========!!這是Service!!================//
//====找時間+名稱====//
export class CourseInformationS {
  constructor(private client: HttpClient) { }

  /**找課程資訊 */
  getCourseInfo(sessionId: number): Observable<APIResponse<CourseInfoI>> {
    return this.client.get<APIResponse<CourseInfoI>>(`${environment.apiUrl}/Exp/Exp/CourseInfo/${sessionId}`);
  }

  /**找最新課程 */
  getLatestCourseByCoach(coachId: number): Observable<APIResponse<CourseInfoI>> {
    return this.client.get<APIResponse<CourseInfoI>>(
      `${environment.apiUrl}/Exp/Exp/LatestCourse/${coachId}`
    );
  }

  /**建模板 */
  createCourseT(data: FormData): Observable<any> {
    return this.client.post<any>(`${environment.apiUrl}/Exp/Exp/AddCourseT`, data);
  }

}
