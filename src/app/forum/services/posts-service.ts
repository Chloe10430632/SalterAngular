import { environment } from './../../../environments/environment';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostList } from '../interfaces/postList';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { map, zip } from 'rxjs';
import { CreatePostDto } from '../interfaces/CreatePostDto';


@Injectable({
  providedIn: 'root',
})
export class PostsService {

  constructor(private http: HttpClient) { }

  //GET 熱門貼文
  GetPopPostsApi(lastViewCount?: number, lastPostId?: number): Observable<PostList[]> {
    let params = new HttpParams().set('sortBy', 'popular');

    //呼叫第二次以上會有參數帶進來，執行分頁邏輯
    if (lastViewCount !== undefined && lastPostId !== undefined) {
      params = params
        .set('lastViewCount', lastViewCount.toString())
        .set('lastId', lastPostId.toString());
    }

    const apiData$ = this.http.get<PostList[]>(`${environment.apiUrl}/Forum/Posts`, { params });
    const minimumDelay$ = timer(1200);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  //GET 即時貼文
  GetNewPostsApi(lastCreatedAt?: string, lastPostId?: number): Observable<PostList[]> {
    let params = new HttpParams().set('sortBy', 'new');

    if (lastCreatedAt !== undefined && lastPostId !== undefined) {
      params = params
        .set('lastCreatedAt', lastCreatedAt.toString())
        .set('lastId', lastPostId.toString());
    }

    const apiData$ = this.http.get<PostList[]>(`${environment.apiUrl}/Forum/Posts`, { params });
    const minimumDelay$ = timer(1200);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  //GET 追蹤貼文
  GetFollowPostsApi(lastCreatedAt?: string, lastPostId?: number): Observable<PostList[]> {
    let params = new HttpParams().set('sortBy', 'follow');
    if (lastCreatedAt !== undefined && lastPostId !== undefined) {
      params = params
        .set('lastCreatedAt', lastCreatedAt.toString())
        .set('lastId', lastPostId.toString());
    }

    const apiData$ = this.http.get<PostList[]>(`${environment.apiUrl}/Forum/Posts`, { params });
    const minimumDelay$ = timer(1200);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  //GET 看板貼文
  GetBoardPostsApi(boardId: number, lastViewCount?: number, lastPostId?: number): Observable<PostList[]> {
    let params = new HttpParams().set('boardId', boardId.toString());

    if (lastViewCount !== undefined && lastPostId !== undefined) {
      params = params
        .set('lastViewCount', lastViewCount.toString())
        .set('lastId', lastPostId.toString());
    }

    const apiData$ = this.http.get<PostList[]>(`${environment.apiUrl}/Forum/Posts`, { params });
    const minimumDelay$ = timer(1000);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );

  }

  //POST 發佈貼文圖片 IFormFile
  PostUploadImages(files: File[]): Observable<HttpEvent<string[]>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<string[]>(`${environment.apiUrl}/Forum/Posts/Images`, formData, {
      reportProgress: true, // 關鍵：開啟進度回報
      observe: 'events'     // 關鍵：觀察所有事件（而不只是最後的結果）
    });
  }
  //POST 發佈貼文內容 Json
  PostCreatePost(payload: CreatePostDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Forum/Posts`, payload);
  }


}
