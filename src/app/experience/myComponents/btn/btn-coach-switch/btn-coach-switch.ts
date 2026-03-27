import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../../../../shared/footer/footer';
 import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-btn-coach-switch',
  imports: [Footer],
  templateUrl: './btn-coach-switch.html',
  styleUrl: './btn-coach-switch.css',
})
export class BtnCoachSwitch implements OnInit {
  currentUser: any = null;
  isLogin = false;
  hasProfile = false;

  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    })
  }


  switchStatus() {
    if (!this.currentUser) {
      this.router.navigate(['/login']);//登入
    }
    else if (this.currentUser && !this.hasProfile) {
      this.router.navigate(['experience/coachcreate']);//createcoach
    }
    else {
      this.router.navigate(['experience/coachisland']); //functions
    }
  }

}
