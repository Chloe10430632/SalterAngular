import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CourseInfoI } from '../Interfaces/IICourse';

@Injectable({
  providedIn: 'root',
})
//========!!這是Service!!================//
//====找時間+名稱====//
export class CourseInformationS {
  constructor(private client: HttpClient) { }

  /**找課程資訊 */
  getCourseInfo(sessionId: number): Observable<CourseInfoI> {
    return this.client.get<CourseInfoI>(`${environment.apiUrl}/Exp/Exp/CourseInfo/${sessionId}`);
  }

  /**找最新課程 */
  getLatestCourseByCoach(coachId: number): Observable<CourseInfoI> {
    return this.client.get<CourseInfoI>(
      `${environment.apiUrl}/Exp/Exp/LatestCourse/${coachId}`
    );
  }

  /**建模板 */
  // createCourseT():{}

}
