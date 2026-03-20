// 推播通知中心
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // 關鍵：使用 BehaviorSubject 確保訂閱時能拿到最新值，初始為 null
  private messageSource = new BehaviorSubject<{ msg: string; type: 'success' | 'error' } | null>(null);

  // 暴露給 HTML 訂閱的 Observable
  message$ = this.messageSource.asObservable();

  show(msg: string, type: 'success' | 'error' = 'success') {
    this.messageSource.next({ msg, type }); //對他講話

    timer(4000).subscribe(() => {
      this.messageSource.next(null); //會變成false family，讓 HTML 不見
    });
  }
}
