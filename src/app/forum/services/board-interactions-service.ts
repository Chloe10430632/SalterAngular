import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { BoardInteractionsRequest } from '../interfaces/boardInteractionsRequest';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoardInteractionsService {

  constructor(private http: HttpClient) { }

  /**看板互動Api */
  postBoardInteractionsApi(request: BoardInteractionsRequest) {
    return this.http.post(`${environment.apiUrl}/Forum/BoardInteractions`, request);
  }

}
