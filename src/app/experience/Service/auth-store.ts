import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  currentUser = signal<{ id: number; name: string; role: string } | null>(null);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentUser.set({
          id: +decoded.sub,
          name: decoded.UserName || '使用者',
          role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        });
      } catch {
        this.currentUser.set(null);
      }
    }
    console.log('AuthStore-currentUser:', this.currentUser());
  }

  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
