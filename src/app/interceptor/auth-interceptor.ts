import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../shared/notifyService/notification-service';
import { AuthService } from '../core/services/auth-service';



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(NotificationService);
  const token = localStorage.getItem('token');
  const authService = inject(AuthService); // 👈 注入 AuthService

  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        // 使用更安全的解碼方式，處理 Base64 的特殊字元
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);

        if (now >= expiry) {
          authService.logout();
          notify.show("登入已過期，請重新登入", 'error');
          return throwError(() => new Error('Token Expired'));
        }
      }
    } catch (error) {
      // 🚨 如果解析失敗（格式不對），不要讓程式掛掉，直接視為無效 Token 處理
      console.error('Interceptor JWT 解析失敗:', error);
      // 視情況決定是否要強制登出
      // authService.logout();
    }
  }

  const skipUrls = [
    '/login',
    '/register',
    '/google-login',
    '/upload-user-picture',
    '/verify-register-otp',
    '/resend-otp'
  ];

  const isPublicApi = skipUrls.some(url => req.url.includes(url));

  // 1. 處理 Request (注入 Token)
  let authReq = req;
  if (token && !isPublicApi) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 2. 處理 Response (錯誤攔截)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '發生未知錯誤';

      if (error.status === 0) {
        errorMessage = '無法連線至伺服器';
      } else {
        switch (error.status) {
          case 401:
            authService.logout();
            errorMessage = error.error?.detail || error.error?.message || '登入逾時或尚未登入，請登入後查看!';
            break;
          case 403:
            if (error.error?.status === 'NeedVerification') {
              return throwError(() => error); //未啟用帳號須回傳狀態
            }
            errorMessage = error.error?.message || '權限不足：您的存取被禁止';
            break;
          case 404:
            router.navigate(['/404']);
            errorMessage = error.error?.message || '您搜尋的資源不存在';
            break;
          case 400:
            errorMessage = error.error?.detail || error.error?.message || '請求參數錯誤';
            break;
          case 500:
            errorMessage = '伺服器內部錯誤，Salter夥伴們正在搶修中!!';
            break;
          default:
            errorMessage = `後端錯誤 (${error.status}): ${error.message}`;
        }
      }

      notify.show(errorMessage, 'error');
      return throwError(() => new Error(errorMessage));
    })
  );
};
