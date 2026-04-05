import { CurrentUser } from './../../../../forum/interfaces/currentUser';
import { CourseInformationS } from './../../../Service/course-information';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CourseSessionInfoI } from '../../../Interfaces/IICourse';
import { NotificationService } from '../../../../shared/notifyService/notification-service';
import Swal from 'sweetalert2';
import { AuthStore } from '../../../Service/auth-store';
import { Router } from '@angular/router';
import { TransactionServiceS } from '../../../Service/transaction.service';
import { firstValueFrom } from 'rxjs';

//===============!!這是 子 元件!!==================//
//===============!!上架中!!==================//

@Component({
  selector: 'app-course-publish',
  imports: [CommonModule],
  templateUrl: './course-publish.html',
  styleUrl: './course-publish.css',
})
export class CoursePublish implements OnChanges {
  isLoading = false;
  //-------------------------------------------//
  constructor(public authS: AuthStore,
    private router: Router,
    private transS: TransactionServiceS,
    private notifyS: NotificationService) { }
  //-------------------------------------------//
  ngOnChanges(): void {
    console.log('P-子元件收到的資料:', this.data);
  }
  @Input() data!: CourseSessionInfoI;
  @Input() mode: 'admin' | 'public' = 'admin';
  @Output() remove = new EventEmitter<number>();
  //-------------------------------------------//
  get isCoachSelf(): boolean {
    const user = this.authS.currentUser();
    if (!user || !this.data) return false;
    console.log('user.id:', user.id, typeof user.id);
    console.log('data.coachId:', this.data.coachId, typeof this.data.coachId);
    console.log('相等?', user.id == this.data.coachId);
    return user.id == this.data.coachId;
  }
  get isFull(): boolean {
    const max = this.data?.maxParticipants ?? 0;
    const current = this.data?.currentParticipants ?? 0;
    return max > 0 && current >= max;
  }
  //-------------------------------------------//
  checkIsPast(startDate: string): boolean {
    if (!startDate || startDate.length === 0) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const courseDate = new Date(startDate);
    courseDate.setHours(0, 0, 0, 0);
    return courseDate < today;
  }

  onDelete(id: number) {
    if (!id) return;
    if ((this.data.currentParticipants ?? 0) > 0) {
      Swal.fire({
        title: '無法下架',
        text: `目前已有 ${this.data.currentParticipants} 位學生報名，不可以任性`,
        icon: 'error',
        confirmButtonColor: '#8B4513'
      });
      return;
    }
    this.remove.emit(id);
  }

  async onReserve() {
    if (!this.authS.isLoggedIn) {
      this.notifyS.show('請先登入才能預約喔！', 'error');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.data?.sessionId) {
      this.notifyS.show('課程資料尚未載入完成', 'error');
      return;
    }
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
        this.transS.reserve({ courseSessionId: this.data.sessionId })
      );
      const transactionId = reserveRes?.data?.data;
      if (!transactionId) throw new Error('拿不到 TransactionId');
      const htmlForm = await firstValueFrom(
        this.transS.getOrderForm({ transactionId: Number(transactionId), description: '課程預約' })
      );
      const doc = new DOMParser().parseFromString(htmlForm!, 'text/html');
      const form = doc.querySelector('form') as HTMLFormElement;
      if (!form) throw new Error('找不到付款表單');
      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      Swal.fire({ title: '預約失敗', text: err?.error?.message ?? '請稍後再試', icon: 'error' });
    } finally {
      this.isLoading = false;
    }
  }
}
