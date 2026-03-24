import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { IUserProfile } from '../../interfaces/IUserProfile';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {

  user?: IUserProfile;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.error('抓取資料失敗', err);
      }
    });
  }

}
