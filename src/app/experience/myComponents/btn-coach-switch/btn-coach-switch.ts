import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-btn-coach-switch',
  imports: [],
  templateUrl: './btn-coach-switch.html',
  styleUrl: './btn-coach-switch.css',
})
export class BtnCoachSwitch {
  isLogin = false;
  hasProfile = false;

  constructor(private router: Router) { }

  switchStatus() {
    if (!this.isLogin) {
      this.router.navigate(['/login']);//登入
    }
    else if (this.isLogin && !this.hasProfile) {
      this.router.navigate(['/coachcreate']);//createcoach
    }
    else {
      this.router.navigate(['/coachisland']); //functions
    }
  }

}
