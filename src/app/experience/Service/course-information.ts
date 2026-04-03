import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CourseSessionInfoI, TempInfoI } from '../Interfaces/IICourse';
import { APIResponse } from '../Interfaces/IIcoachAllinfo';

@Injectable({
  providedIn: 'root',
})
//========!!這是Service!!================//
//====找課程相關====//
export class CourseInformationS {
  constructor(private client: HttpClient) { }

  /**找課程資訊 */
  getCourseInfo(sessionId: number): Observable<APIResponse<CourseSessionInfoI>> {
    return this.client.get<APIResponse<CourseSessionInfoI>>(`${environment.apiUrl}/Exp/Exp/CourseInfo/${sessionId}`);
  }

  /**找最新課程 */
  getLatestCourseByCoach(coachId: number): Observable<APIResponse<CourseSessionInfoI>> {
    return this.client.get<APIResponse<CourseSessionInfoI>>(
      `${environment.apiUrl}/Exp/Exp/LatestCourse/${coachId}`
    );
  }

  /**教練上架中 */
  getPublishedSessions(): Observable<APIResponse<CourseSessionInfoI[]>> {
    return this.client.get<APIResponse<CourseSessionInfoI[]>>(`${environment.apiUrl}/Exp/Exp/AllSessions`);
  }

  /**建模板 */
  createCourseT(data: FormData): Observable<any> {
    return this.client.post<any>(`${environment.apiUrl}/Exp/Exp/AddCourseT`, data);
  }
  /**編輯模板 */
  editCourseT(tempId: number, data: FormData): Observable<any> {
    return this.client.put<any>(`${environment.apiUrl}/Exp/Exp/EditCourseTemplate/${tempId}`, data)
  }
  /**找模板資訊 */
  getCourseT(): Observable<APIResponse<TempInfoI[]>> {
    return this.client.get<APIResponse<TempInfoI[]>>(
      `${environment.apiUrl}/Exp/Exp/Temp`);
  }
  /**課程選時間上架 */
  createSession(tempId: number, data: FormData): Observable<any> {
    return this.client.post<any>(`${environment.apiUrl}/Exp/Exp/CourseTime/${tempId}`, data)
  }
  /**課程下架 */
  deleteSession(sessionId: number,): Observable<any> {
    return this.client.delete<any>(`${environment.apiUrl}/Exp/Exp/DeleteSession/${sessionId}`)
  }
}
// GET /api/Exp/Exp/CourseInfo/{sessionId}
// GET /api/Exp/Exp/LatestCourse/{coachId}
// POST /api/Exp/Exp/AddCourseT
// PUT /api/Exp/Exp/EditCourseTemplate/{tempId}
// GET /api/Exp/Exp/Temp
// POST /api/Exp/Exp/CourseTime/{templateId}
// DELETE /api/Exp/Exp/DeleteSession/{sessionId}
