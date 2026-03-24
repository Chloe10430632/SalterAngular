import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../shared/notifyService/notification-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(NotificationService);
  const token = localStorage.getItem('token');

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
            errorMessage = error.error?.detail || error.error?.message || '登入逾時或尚未登入，請登入後查看!';
            router.navigate(['/login']);
            break;
          case 403:
            if (error.error?.status === 'NeedVerification') {
              return throwError(() => error); //未啟用帳號須回傳狀態
            }
            errorMessage = '權限不足：您的存取被禁止';
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
