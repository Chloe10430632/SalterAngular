import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardList } from '../interfaces/boardList';
import { timer, zip, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {

  constructor(private http: HttpClient) {

  }

  //GET 全部看板
  GetAllBoardsApi() {
    const apiData$ = this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards'); // 真正的 Api
    const minimumDelay$ = timer(1200); // 1.2 秒的沙漏

    // zip 會等待兩者都完成。
    // 如果 Api 50ms 就回來，它會等滿 1.5 秒。
    // 如果 Api 跑了 3 秒，它會等 3 秒（以慢的為主）。
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data) // 丟掉 timer 的值，只回傳 Api 資料
    );



    // return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards');
  }
  //GET 熱門看板
  GetPopBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=popular');
  }

  GetTop5PopBoardsApi() {
    const apiData$ = this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=popular&takeSize=5');
    const minimumDelay$ = timer(1000);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  //GET 追蹤推薦看板
  GetFollowBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=follow');
  }

  GetTop5FollowBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=follow&takeSize=5');
  }
}
