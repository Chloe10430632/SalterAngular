import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse, CourseInfoI } from '../Interfaces/course.model';

@Injectable({
  providedIn: 'root',
})
//========!!這是Service!!================//
//====找時間+名稱====//
//---誰再用: 教練卡、課程資訊展開(、課程上架選時間(、課程模板編輯、模板新增、課程時段刪除))
export class CourseS {
  constructor(private client: HttpClient) { }


  getCourseInfo(sessionId: number): Observable<APIResponse<CourseInfoI>> {
    return this.client.get<APIResponse<CourseInfoI>>(`${environment.apiUrl}/Exp/Exp/CourseInfo/${sessionId}`);
  }

  //最新課
  getLatestCourseByCoach(coachId: number): Observable<APIResponse<CourseInfoI>> {
    return this.client.get<APIResponse<CourseInfoI>>(
      `${environment.apiUrl}/Exp/Exp/LatestCourse/${coachId}`
    );
  }


}
