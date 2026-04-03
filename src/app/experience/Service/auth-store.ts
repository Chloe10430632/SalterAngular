import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  isLogin = signal(false);
  
  setLoginStatus(status: boolean) {
    this.isLogin.set(status);
  }
}
