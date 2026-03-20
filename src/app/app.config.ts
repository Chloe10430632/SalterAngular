import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,            // 顯示 3 秒
      positionClass: 'toast-bottom-right', // 顯示在右下角
      preventDuplicates: true,  // 防止重複內容連續彈出
      progressBar: true,        // 顯示倒數進度條（很有質感！）
      closeButton: true,        // 顯示關閉按鈕
    }),

  ]
};
