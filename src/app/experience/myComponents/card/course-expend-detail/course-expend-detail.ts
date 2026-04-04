import { AuthStore } from './../../../Service/auth-store';
import { CourseSessionInfoI } from './../../../Interfaces/IICourse';
import { Component, OnDestroy, OnInit, Pipe } from '@angular/core';
import { NotificationService } from '../../../../shared/notifyService/notification-service';
import { CourseInformationS } from '../../../Service/course-information';
import { Subscription } from 'rxjs';
import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';


//================!! 子 元件!!==============================//
//================課程折疊==================================//

@Component({
  selector: 'app-course-expend-detail',
  imports: [NgClass, CommonModule, DecimalPipe],
  templateUrl: './course-expend-detail.html',
  styleUrl: './course-expend-detail.css',
  standalone: true
})
export class CourseExpendDetail implements OnInit, OnDestroy {
  data?: CourseSessionInfoI | null = null;
  private sub = new Subscription();
  //--------------------------------------------//
  constructor(private notifyS: NotificationService,
    private couresS: CourseInformationS,
    public authS: AuthStore,
    private router: Router
  ) { }
  //--------------------------------------------//
  ngOnInit() {
    this.loadLatestCourse(1001024);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //--------------------------------------------//

  get isCoachSelf(): boolean {
    const user = this.authS.currentUser();
   if (!user || !this.data) return false;

    console.log('當前登入者 ID:', user.id);
    console.log('課程教練 ID:', this.data.coachId);

    return user.id == this.data.coachId;
  }
  get canBook(): boolean {
    if (!this.data) return false;
    const isFull = this.data.currentStudents >= this.data.maxStudents;
    return !this.isCoachSelf && !isFull && !this.checkIsPast(this.data.startDate);
  }
  checkIsPast(date: string): boolean {
    return new Date(date) < new Date();
  }

  //--------------------------------------------//
  loadLatestCourse(coachId: number) {
    this.sub.add(
      this.couresS.getLatestCourseByCoach(coachId).subscribe(res => {
        if (res.isSuccess) {
          this.data = res.data;
        }
      })
    );
  }
  onBooking() {
    // 1. 先檢查有沒有登入
    if (!this.authS.isLoggedIn) {
      this.notifyS.show('請先登入才能預約喔！', "error");
      // 可以導向登入頁
      this.router.navigate(['/login']);
      return;
    }
    if (this.isCoachSelf) {
      this.notifyS.show('教練不能預約自己的課程喔！', "error");
      return;
    }
    console.log('當前學生 ID:', this.authS.currentUser()?.id);
    console.log('準備結帳課程 ID:', this.data?.sessionId);
    //去寫交易S//
  }
}



