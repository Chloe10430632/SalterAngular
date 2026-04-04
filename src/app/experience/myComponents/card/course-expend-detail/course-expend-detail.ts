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
    this.loadLatestCourse(1001024);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //--------------------------------------------//
  @Input() courseSessionId!: number;

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


  //--------------------------------------------//
  checkIsPast(date: string): boolean {
    return new Date(date) < new Date();
  }
  loadLatestCourse(coachId: number) {
    this.sub.add(
      this.couresS.getLatestCourseByCoach(coachId).subscribe(res => {
        if (res.isSuccess) {
          this.data = res.data;
        }
      })
    );
  }
  async onReserve() {
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
    const confirm = await Swal.fire({
      title: '確認預約？',
      text: '預約後將導向綠界付款頁面',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '確認預約',
      cancelButtonText: '取消'
    });
    if (!confirm.isConfirmed) return;
    this.isLoading = true;

    try {
      const reserveRes = await firstValueFrom(
        this.transS.reserve({ courseSessionId: this.courseSessionId })
      );
      const transactionId = reserveRes?.data?.data;
      if (!transactionId) throw new Error('拿不到 TransactionId');
      // Step 3: 拿綠界 HTML 表單
      const htmlForm = await firstValueFrom(
        this.transS.getOrderForm({
          transactionId: Number(transactionId),
          description: '課程預約'
        })
      )


      // Step 4: 寫入 DOM，讓 <script> 自動 submit 導去綠界
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlForm!, 'text/html');
      const form = doc.querySelector('form') as HTMLFormElement;

      if (!form) throw new Error('找不到付款表單');
      document.body.appendChild(form);
      form.submit(); // 導去綠界

    }
    catch (err: any) {
      Swal.fire({
        title: '預約失敗',
        text: err?.error?.message ?? '請稍後再試',
        icon: 'error'
      });
    }
    finally { this.isLoading = false; }
  }
}



