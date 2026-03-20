import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // 或是從你的 AuthService 拿

  // 1. 定義「不需要帶 Token」的關鍵字清單
  const skipUrls = [
    '/Login',
    '/Register',
    '/GoogleLogin',
    '/UploadUserPicture',
    '/VerifyRegisterOtp',
    '/ResendOtp'
  ];

  // 2. 檢查現在這個 API 的網址是否包含在白名單內
  const isPublicApi = skipUrls.some(url => req.url.includes(url));

  // 3. 只有「口袋有 Token」且「不是要去登入/註冊」時，才貼標籤
  if (token && !isPublicApi) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 4. 其餘情況（包含還沒登入、或去註冊時）都直接放行
  return next(req);
};
