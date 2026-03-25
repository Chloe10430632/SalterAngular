import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // [cite: 52]
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-pay',
  imports: [],
  templateUrl: './pay.html',
  styleUrl: './pay.css',
})
export class Pay {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  // 用來存放綠界回傳的 HTML 表單
  externalHtml: SafeHtml | null = null;

  pay() {
    const apiUrl = 'https://localhost:7017/api/Transac/Transaction/PayResult';

    // 呼叫 API 取回綠界的表單內容 [cite: 52]
    this.http.post(apiUrl, {}, { responseType: 'text' }).subscribe({
      next: (htmlStr) => {
        // 這是最關鍵的一步：將字串轉為 Angular 信任的 HTML 並顯示
        this.externalHtml = this.sanitizer.bypassSecurityTrustHtml(htmlStr);

        // 稍微延遲一下，讓 Angular 把 HTML 渲染出來後，表單會自動 submit
        setTimeout(() => {
          const form = document.getElementById('ecpay-form') as HTMLFormElement;
          if (form) form.submit();
        }, 100);
      },
      error: (err) => console.error('支付請求失敗', err)
    });
  }
}
