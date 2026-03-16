import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUploadUserPicture } from '../interfaces/IUploadUserPicture';
import { Observable } from 'rxjs';
import { IRegister, RegisterResponse } from '../interfaces/IRegister';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {

  }

  postUploadUserPictureApi(file: File): Observable<IUploadUserPicture> {
    const formData = new FormData();

    formData.append('file', file);//'file' 要跟後端  IFormFile file 一樣(對齊)

    return this.http.post<IUploadUserPicture>(
      'https://localhost:7017/api/User/User/UploadUserPicture',
      formData
    );
  }

  postRegister(data: IRegister): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      'https://localhost:7017/api/User/User/Register', data
    )
  }


}
