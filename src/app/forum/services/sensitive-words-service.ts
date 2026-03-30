import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckSensitiveWords } from '../interfaces/CheckSensitiveWords';

@Injectable({
  providedIn: 'root',
})
export class SensitiveWordsService {

  constructor(private http: HttpClient) { }

  /**POST 檢查使用者輸入文字 */
  postCheckWordsApi(content: string) {
    // 注意：後端接收 string 需確保 Headers 正確
    return this.http.post<CheckSensitiveWords>(`${environment.apiUrl}/Forum/SensitiveWords/check`, `"${content}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
