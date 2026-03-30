import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  // Python FastAPI 的網址
  private apiUrl = 'http://127.0.0.1:8000/chat';

  sendMessage(msg: string): Observable<any> {
    // 這裡送出的 JSON 結構要跟 Python 的 user_input.get("message") 對上
    return this.http.post(this.apiUrl, { message: msg });
  }
}
