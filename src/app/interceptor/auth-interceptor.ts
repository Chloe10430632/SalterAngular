import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../shared/notifyService/notification-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(NotificationService);
  //  const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMiIsImp0aSI6IjRiMDE2OGFlLTM3MTItNDZjNy1hM2E1LWMyZTQyNmFjYjI5YyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiMzIiLCJVc2VyTmFtZSI6IkNobG9lMTA0MzA2MzIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhMjEzMDcwOTZAZ21haWwuY29tIiwiQXZhdGFyIjoiL2FkbWluL2ltZ3MvMjAyNjAzMTgxNjEzMjNfS2Vyb3JvLnBuZyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ik5vcm1hbFVzZXIiLCJleHAiOjE3NzM5ODkzNDEsImlzcyI6IlNhbHRlcldlYkFwaSIsImF1ZCI6IlNhbHRlckFuZ3VsYXJDbGllbnQifQ.0exj2hTOO74MHBOdEbo_2vFNH3XBkkQendAJpWasOKc"; //測試用Chloe123456帳號

  // 1. 處理 Request (注入 Token)
  let authReq = req;
  if (token) {
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
            errorMessage = '登入逾時或尚未登入，請登入後查看!';
            // router.navigate(['/login']);
            break;
          case 403:
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
