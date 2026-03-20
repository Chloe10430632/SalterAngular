import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostInteractionsRequest } from '../interfaces/postInteractionsRequest';

@Injectable({
  providedIn: 'root',
})
export class PostInteractionsService {

  constructor(private http: HttpClient) { }

  //POST 貼文互動
  postPostInteractionsApi(request: PostInteractionsRequest) {
    return this.http.post('https://localhost:7017/api/Forum/PostInteractions', request);
  }
}
