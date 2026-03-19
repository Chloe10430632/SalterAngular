import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostList } from '../interfaces/postList';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { map, zip } from 'rxjs';

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

    const apiData$ = this.http.get<PostList[]>('https://localhost:7017/api/Forum/Posts', { params });
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

    const apiData$ = this.http.get<PostList[]>('https://localhost:7017/api/Forum/Posts', { params });
    const minimumDelay$ = timer(1200);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  //Get 追蹤貼文
  GetFollowPostsApi(lastCreatedAt?: string, lastPostId?: number): Observable<PostList[]> {
    let params = new HttpParams().set('sortBy', 'follow');
    if (lastCreatedAt !== undefined && lastPostId !== undefined) {
      params = params
        .set('lastCreatedAt', lastCreatedAt.toString())
        .set('lastId', lastPostId.toString());
    }

    const apiData$ = this.http.get<PostList[]>('https://localhost:7017/api/Forum/Posts', { params });
    const minimumDelay$ = timer(1200);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }


}
