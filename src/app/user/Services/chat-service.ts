import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatResponse } from '../interfaces/IChatResponse';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);

  // 指向你的 .NET 8 Area 路由
  private apiUrl = `${environment.apiUrl}/User/User/AskXiaoSha`;

  sendMessage(msg: string): Observable<ChatResponse> {
    // 這裡送出的物件要符合 C# 的 ChatRequest 類別
    return this.http.post<ChatResponse>(this.apiUrl, { message: msg });
  }
}
