import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../shared/notifyService/notification-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(NotificationService);
  //  const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOSIsImp0aSI6IjhmOGE0MDFlLTEyMjgtNGY4My1hMjVlLTJjOWI1MTIyMjM0OSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiMjkiLCJVc2VyTmFtZSI6ImJhYnViYWJ1MTExMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImJhYnViYWJ1QHRlc3QuY29tIiwiQXZhdGFyIjoiL2FkbWluL2ltZ3MvMjAyNjAzMTEyMjUwX0tlcm9yby5wbmciLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJOb3JtYWxVc2VyIiwiZXhwIjoxNzc0MDIyODQ2LCJpc3MiOiJTYWx0ZXJXZWJBcGkiLCJhdWQiOiJTYWx0ZXJBbmd1bGFyQ2xpZW50In0.llXtRlMh9KNOTOs54Tm_4Wy0WtWZvSHj2913p_FbL3k"; //測試用Chloe123456帳號


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
