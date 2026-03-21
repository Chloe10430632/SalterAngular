import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SCoachPersonalInformation {

  constructor(private client: HttpClient) { }

  hasProfile = false;

  /**申請 */
  balnkData(saveData: any): Observable<any> {
    const apiA = "https://localhost:7017/api/Exp/Exp/BecomeCoach";
    return this.client.post(apiA, saveData);
  }
  /**帶入原資料 */
  coachData(coachId: number): Observable<any> {
    const apiB = "https://localhost:7017/api/Exp/Exp/Info";
    return this.client.get(`${apiB}+${coachId}`);
  }
  /**改資料 */
  updateData(coachId: number, updateData: any): Observable<any> {
    const apiU = "https://localhost:7017/api/Exp/Exp/EditCoach";
    return this.client.get(`${apiU}+${coachId}`, updateData);
  }

}

