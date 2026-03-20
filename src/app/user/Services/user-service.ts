import { ILogin } from './../interfaces/ILogin';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUploadUserPicture } from '../interfaces/IUploadUserPicture';
import { Observable } from 'rxjs';
import { IRegister } from '../interfaces/IRegister';
import { IVerifyRegisterOtp } from '../interfaces/IVerifyRegisterOtp';
import { IResendOtp } from '../interfaces/IResendOtp';
import { IBaseResponse } from '../interfaces/IBaseResponse';
import { LoginResult } from '../interfaces/ILoginResponse';


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

  postRegister(data: IRegister): Observable<IBaseResponse> {
    return this.http.post<IBaseResponse>(
      'https://localhost:7017/api/User/User/Register', data
    )
  }

  postVerifyRegisterOtp(data: IVerifyRegisterOtp): Observable<IBaseResponse> {
    const url = 'https://localhost:7017/api/User/User/VerifyRegisterOtp';
    return this.http.post<IBaseResponse>(url, data);
  }

  postResendOtp(data: IResendOtp): Observable<IBaseResponse> {
    const url = 'https://localhost:7017/api/User/User/ResendOtp';
    return this.http.post<IBaseResponse>(url, data)
  }

  // postLogin(data: ILogin): Observable<LoginResult> {
  //   const url = 'https://localhost:7017/api/User/User/Login';
  //   return this.http.post<LoginResult>(url, data)
  // }


}
