import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCommentDto } from '../interfaces/CreateCommentDto';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) { }

  //POST 新增留言
  postCreateComment(dto: CreateCommentDto) {
    return this.http.post(`${environment.apiUrl}/Forum/Comments`, dto);
  }

  //PUT 修改留言
  putEditComment(commentId: number, dto: CreateCommentDto) {
    return this.http.put(`${environment.apiUrl}/Forum/Comments/${commentId}`, dto);
  }

  //DELETE 刪除留言
  delDeleteComment(commentId: number) {
    return this.http.delete(`${environment.apiUrl}/Forum/Comments/${commentId}`);
  }



}
