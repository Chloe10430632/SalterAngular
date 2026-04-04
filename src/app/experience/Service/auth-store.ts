import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  currentUser = signal<{ id: number; name: string; role: string } | null>(null);
  constructor() {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
    console.log(this.currentUser());
  }

  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
