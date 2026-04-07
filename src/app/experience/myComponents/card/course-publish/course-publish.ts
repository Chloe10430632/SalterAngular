import { CurrentUser } from './../../../../forum/interfaces/currentUser';
import { CourseInformationS } from './../../../Service/course-information';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
export class CoursePublish implements OnChanges, OnDestroy {
  isLoading = false;
  private timer: any;
  //-------------------------------------------//
  constructor(public authS: AuthStore,
    private router: Router,
    private transS: TransactionServiceS,
    public notifyS: NotificationService) { }
  //-------------------------------------------//
  ngOnChanges(): void {
    console.log('P-子元件收到的資料:', this.data);
    this.stopCarousel();
    setTimeout(() => this.startCarousel(), 100);
  }
  ngOnDestroy(): void {
    this.stopCarousel();
  }

  @Input() data!: CourseSessionInfoI;
  @Input() mode: 'admin' | 'public' = 'admin';
  @Output() remove = new EventEmitter<number>();
  @ViewChild('carousel') carouselRef!: ElementRef;
  //-------------------------------------------//
  get isCoachSelf(): boolean {
    const coachId = localStorage.getItem('coachId');
    if (!coachId || !this.data) return false;
    return Number(coachId) == this.data.coachId;
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
      this.notifyS.show("已經有學生報名，不能任性", "error");
      return;
    }
    this.remove.emit(id);
  }
  startCarousel() {
    const images = this.data?.imageUrls ?? [];
    if (images.length <= 1) return; // 只有一張不需要輪播
    this.timer = setInterval(() => {
      const el = this.carouselRef?.nativeElement;
      if (!el) return;
      const itemWidth = el.offsetWidth;
      const maxScroll = el.scrollWidth - itemWidth;
      const next = el.scrollLeft + itemWidth;
      el.scrollTo({ left: next >= maxScroll - 1 ? 0 : next, behavior: 'smooth' });
    }, 2000);
  }

  stopCarousel() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
    const user = this.authS.currentUser();
    const isOwner = user && String(user.id) === String(this.data?.coachUserId);

    console.log("誰:", user);
    console.log("另一個是誰", this.data.coachUserId);
    if (isOwner) {
      this.notifyS.show('教練不能預約自己的課程', "error");
      return; // 直接攔截，不讓它往下走
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
      const transactionId = reserveRes?.data;
      if (!transactionId) throw new Error('拿不到 TransactionId');
      const htmlForm = await firstValueFrom(
        this.transS.getOrderForm({
          transactionId: Number(transactionId),
          description: '課程預約',
          typeId: 3
        })
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
