import { Injectable } from '@angular/core';
import { BoardInteractionsRequest } from '../interfaces/boardInteractionsRequest';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoardInteractionsService {

  constructor(private http: HttpClient) { }

  postBoardInteractionsApi(request: BoardInteractionsRequest) {
    return this.http.post('https://localhost:7017/api/Forum/BoardInteractions', request);
  }
}
