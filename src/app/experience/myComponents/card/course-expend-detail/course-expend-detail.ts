import { AuthStore } from './../../../Service/auth-store';
import { CourseSessionInfoI } from './../../../Interfaces/IICourse';
import { Component, Input, OnDestroy, OnInit, Pipe } from '@angular/core';
import { NotificationService } from '../../../../shared/notifyService/notification-service';
import { CourseInformationS } from '../../../Service/course-information';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionServiceS as TransactionServiceS } from '../../../Service/transaction.service';
import Swal from 'sweetalert2';


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
  isLoading: boolean = false;
  //--------------------------------------------//
  constructor(private notifyS: NotificationService,
    private couresS: CourseInformationS,
    private transS: TransactionServiceS,
    public authS: AuthStore,
    private router: Router
  ) { }
  //--------------------------------------------//
  ngOnInit() {

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //--------------------------------------------//
  @Input() set coachId(id: number | undefined) {
    if (id && id > 0) {
      this.loadLatestCourse(id); // 當 id 變動時，才去抓資料
      console.log("子接到:", id);
    }
  }

  get isCoachSelf(): boolean {
    const user = this.authS.currentUser();
    if (!user || !this.data) return false;

    console.log('當前登入者 ID:', user.id);
    console.log('課程教練 ID:', this.data.coachId);

    return user.id == this.data.coachId;
  }
  get canBook(): boolean {
    if (!this.data) return false;
    const isFull = this.data.currentParticipants >= this.data.maxParticipants;
    return !this.isCoachSelf && !isFull && !this.checkIsPast(this.data.startDate);
  }


  //--------------------------------------------//
  checkIsPast(date: string): boolean {
    return new Date(date) < new Date();
  }
  loadLatestCourse(coachId: number) {
    this.couresS.getLatestCourseByCoach(coachId).subscribe(res => {
      if (res.isSuccess) {
        this.data = res.data;
        console.log("課程:  ", res);
      }
    });

  }

  moreCourses(id: number) {
    this.router.navigate([`/experience/coachcoursemore/${id}`])
  }
}



