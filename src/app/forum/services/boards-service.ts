import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardList } from '../interfaces/boardList';
import { timer, zip, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardDetails } from '../interfaces/boardDetails';

@Injectable({
  providedIn: 'root',
})

export class BoardsService {

  constructor(private http: HttpClient) { }

  /**GET 全部看板 */
  GetAllBoardsApi() {
    const apiData$ = this.http.get<BoardList[]>(`${environment.apiUrl}/Forum/Boards`);
    const minimumDelay$ = timer(1200);

    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  /**GET 熱門看板 */
  GetPopBoardsApi() {
    return this.http.get<BoardList[]>(`${environment.apiUrl}/Forum/Boards?sortBy=popular`);
  }

  /**GET 熱門看板前五名 */
  GetTop5PopBoardsApi() {
    const apiData$ = this.http.get<BoardList[]>(`${environment.apiUrl}/Forum/Boards?sortBy=popular&takeSize=5`);
    const minimumDelay$ = timer(1000);
    return zip(apiData$, minimumDelay$).pipe(
      map(([data, _]) => data)
    );
  }

  /**GET 追蹤推薦看板 */
  GetFollowBoardsApi() {
    return this.http.get<BoardList[]>(`${environment.apiUrl}/Forum/Boards?sortBy=follow`);
  }

  /**GET 追蹤推薦看板前五名 */
  GetTop5FollowBoardsApi() {
    return this.http.get<BoardList[]>(`${environment.apiUrl}/Forum/Boards?sortBy=follow&takeSize=5`);
  }

  /**GET 單一看板 */
  GetBoardByIdApi(boardId: number) {
    return this.http.get<BoardDetails>(`${environment.apiUrl}/Forum/Boards/${boardId}`);
  }

}
