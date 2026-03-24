import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../core/services/auth-service';


@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }


  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }


  //測試攔截器
  testAuth() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        console.log('✅ 攔截器成功！這是你的基本資料：', res);
        alert('海關通關成功！有帶 Token！');
      },
      error: (err) => {
        console.error('❌ 失敗！請檢查 F12 Network 的 Authorization 標頭', err);
        alert('海關攔截失敗，可能沒帶 Token 或 Token 錯了');
      }
    });
  }


}

