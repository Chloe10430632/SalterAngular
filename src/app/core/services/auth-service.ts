import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LoginResult, ILoginSuccess } from '../../user/interfaces/ILoginResponse';
import { ILogin } from '../../user/interfaces/ILogin';
import { jwtDecode } from "jwt-decode";
import { IGoogleLogin } from '../../user/interfaces/IGoogleLogin';
import { CurrentUser } from '../../forum/interfaces/currentUser';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<any | null>(null);

  /**目前登入的使用者 */
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // 網頁一打開，自動檢查有沒有舊的 Token
    this.loadStoredToken();
  }

  postLogin(data: ILogin): Observable<LoginResult> {
    // 這裡維持你原本寫好的邏輯
    return this.http.post<LoginResult>(`${this.apiUrl}/User/User/Login`, data);
  }

  googleLogin(data: IGoogleLogin): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.apiUrl}/User/User/GoogleLogin`, data);
  }

  setCurrentUser(token: string) {
    try {
      const decoded: any = jwtDecode(token); // 👈 使用工具拆開 Token
      // const backendUrl = 'https://localhost:7017'; // 你的後端網址
      // 組合出全站通用的使用者物件

      //判斷照片 沒照片帶預設，有照片看照片路徑是http開頭還是 /開頭，
      // 來抓是google帳戶圖片，還是自己上傳圖片
      const getAvatarPath = (avatar: string | null): string => {
        if (!avatar) return `${environment.domain}/admin/imgs/default-avatar.png`;
        if (avatar.startsWith('http')) return avatar;

        const baseUrl = environment.domain;
        const path = avatar.startsWith('/') ? avatar : `/${avatar}`;
        return `${baseUrl}${path}`;
      };
      const user: CurrentUser = {
        id: +decoded.sub, //+號自動轉型成number
        token: token,
        name: decoded.UserName || '使用者',
        // 🎯 直接套用判斷邏輯
        picture: getAvatarPath(decoded.Avatar),
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      };

      //----//
      const coachId = decoded.CoachId;
      if (coachId && coachId !== "0") {
        localStorage.setItem('coachId', coachId); // 把 ID 存進它專屬的抽屜
        if (coachId && coachId !== 0) {
          localStorage.setItem('coachId', coachId.toString());
        } else {
          localStorage.removeItem('coachId'); // 不是教練就移除
        }
        console.log('成功解析並存入 CoachId:', coachId);
      }
      //----/

      localStorage.setItem('token', token); // 存入錢包
      this.currentUserSource.next(user);    // 📢 廣播：「有人登入了！這是他的名字和頭像」
    } catch (error) {
      console.error('Token 解析失敗', error);
      this.logout();
    }

  }



  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('coachId');
    this.currentUserSource.next(null); // 📢 廣播：「有人登出了」

    this.router.navigate(['/login']);
  }

  // 自動載入
  private loadStoredToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setCurrentUser(token); // 既然有舊卡，就直接拿去解析並廣播
    }
  }

  //測試攔截器
  getProfile() {
    // 假設你的後端有一個 GET /api/user/profile
    return this.http.get<CurrentUser>(`${this.apiUrl}/User/User/GetUserProfile`);
  }



}
