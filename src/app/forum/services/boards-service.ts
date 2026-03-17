import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardList } from '../interfaces/boardList';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {

  constructor(private http: HttpClient) {

  }

  //GET 全部看板
  GetAllBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards');
  }
  //GET 熱門看板
  GetPopBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=popular');
  }

  GetTop5PopBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=popular&takeSize=5');
  }

  //GET 追蹤推薦看板
  GetFollowBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=follow');
  }

  GetTop5FollowBoardsApi() {
    return this.http.get<BoardList[]>('https://localhost:7017/api/Forum/Boards?sortBy=follow&takeSize=5');
  }
}
