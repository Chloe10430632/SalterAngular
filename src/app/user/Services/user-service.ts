import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUploadUserPicture } from '../interfaces/IUploadUserPicture';
import { Observable } from 'rxjs';
import { IRegister, IRegisterResponse } from '../interfaces/IRegister';
import { IVerifyRegisterOtp } from '../interfaces/IVerifyRegisterOtp';
import { IResendOtp } from '../interfaces/IResendOtp';


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

  postRegister(data: IRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(
      'https://localhost:7017/api/User/User/Register', data
    )
  }

  postVerifyRegisterOtp(data: IVerifyRegisterOtp) {
    const url = 'https://localhost:7017/api/User/User/VerifyRegisterOtp';
    return this.http.post<any>(url, data);
  }

  postResendOtp(data: IResendOtp) {

    const url = 'https://localhost:7017/api/User/User/ResendOtp';

    return this.http.post<IResendOtp>(url, data)
  }


}
