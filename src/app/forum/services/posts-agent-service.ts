import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgentData } from '../interfaces/AgentData';

@Injectable({
  providedIn: 'root',
})
export class PostsAgentService {

  constructor(private http: HttpClient) { }

  /**呼叫Agent取得對話通道Id */
  GetPostAgentApi() {
    return this.http.get<AgentData>(`${environment.apiUrl}/Forum/PostsAgent/start`);
  }

  /**開始真正與Agent交換資料 */
  PostPostAgentApi() {
    return this.http.get<AgentData>(`${environment.apiUrl}/Forum/PostsAgent`);
  }

}
