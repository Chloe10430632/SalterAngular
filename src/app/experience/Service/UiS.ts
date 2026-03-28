import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, timer, zip } from 'rxjs';


//===========!!Service!!================//

@Injectable({
  providedIn: 'root',
})
export class UiS {
  // 用 Signal 管理Exp區域狀態
  showLoginModal = signal(false);
  countdown = signal(6);
  toastMessage = signal<string | null>(null);
  //=======================================//
  constructor(private router: Router) { }
  //======方法=============================//

  /**檢查登入*/
  checklogin(): boolean {
    const token = localStorage.getItem("token");
    if (!token) {
      this.triggerLoginM(); return false;
    }
    return true;
  }

  triggerLoginM() {
    this.showLoginModal.set(true);
    this.countdown.set(6);
    const timer = setInterval(() => {
      this.countdown.update(v => v - 1);
      if (this.countdown() === 0) {
        clearInterval(timer);
        this.showLoginModal.set(false);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }
  /**吐司訊息 */
  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3500); // 3.5秒後自動消失
  }

};



