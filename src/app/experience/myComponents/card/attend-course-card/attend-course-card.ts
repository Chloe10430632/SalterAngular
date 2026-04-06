import { CourseOrderI } from './../../../Interfaces/IIOrder';
import { NotificationService } from './../../../../shared/notifyService/notification-service';
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { HistoryS } from '../../../Service/history';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { ReviewsS } from '../../../Service/reviews';
import { FormsModule, NgModel } from '@angular/forms';
import { ReviewI } from '../../../Interfaces/IIreview';
import { CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';

//這是 子 元件//
//學習歷程卡-上過的課//
//抓訂單+評論 //


@Component({
  selector: 'app-attend-course-card',
  imports: [CommonModule, AvatarPipe, FormsModule],
  templateUrl: './attend-course-card.html',
  styleUrl: './attend-course-card.css',
  standalone: true
})
export class AttendCourseCard implements OnInit, OnDestroy {
  @Input() data!: CourseOrderI;

  tempRating = 0;
  tempContent = '';
  isEditing = false;
  countdown = 0;
  private countdownTimer: any;

  constructor(private reviewS: ReviewsS, private notifyS: NotificationService) { }

  ngOnInit(): void {
    if (this.canEdit) this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownTimer);
  }

  // 課程當天結束後才能評論
  get canReview(): boolean {
    if (!this.data.startDate) return false;
    const courseDate = new Date(this.data.startDate);
    courseDate.setHours(12, 59, 59, 0);
    return new Date() > courseDate;
  }

  get hasComment(): boolean {
    return !!this.data.rating && this.data.rating > 0;
  }

  // 評論送出後 30 秒內可修改
  get canEdit(): boolean {
    if (!this.data.creatReviewAt) return false;
    const elapsed = (Date.now() - new Date(this.data.creatReviewAt).getTime()) / 1000;
    return elapsed <= 60;
  }

  startCountdown(): void {
    clearInterval(this.countdownTimer);
    const reviewedAt = new Date(this.data.creatReviewAt!).getTime();
    this.countdown = 30;
    this.countdownTimer = setInterval(() => {
      const elapsed = (Date.now() - reviewedAt) / 1000;
      this.countdown = Math.max(0, Math.round(30 - elapsed));
      if (this.countdown <= 0) clearInterval(this.countdownTimer);
    }, 1000);
  }

  startEdit(): void {
    clearInterval(this.countdownTimer);
    this.tempRating = this.data.rating ?? 0;
    this.tempContent = this.data.reviewContent ?? '';
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  submitReview(): void {
    if (!this.tempRating || !this.tempContent.trim()) return;

    const payload = {
      courseOrderId: this.data.courseOrderId,
      rating: this.tempRating,
      reviewContent: this.tempContent
    };

    if (this.hasComment) {
      // 修改
      this.reviewS.editReview(this.data.reviewId!, payload).subscribe({
        next: () => {
          this.data.rating = this.tempRating;
          this.data.reviewContent = this.tempContent;
          this.data.updateReviewAt = new Date().toISOString();
          this.data.creatReviewAt = new Date().toISOString();
          this.isEditing = false;
          this.startCountdown();
        },
        error: () => this.notifyS.show('修改失敗', 'error')
      });
    } else {
      // 新增
      this.reviewS.addReview(payload).subscribe({
        next: () => {
          this.data.rating = this.tempRating;
          this.data.reviewContent = this.tempContent;
          this.data.creatReviewAt = new Date().toISOString();
          this.isEditing = false;
          this.startCountdown();
        },
        error: () => this.notifyS.show('送出失敗', 'error')
      });
    }
  }

  // deleteReview(): void {
  //   if (!this.data.courseSessionId) return;
  //   this.reviewS.deleteReview(this.data.reviewId!).subscribe({
  //     next: () => {
  //       this.data.rating = undefined;
  //       this.data.reviewContent = undefined;
  //       this.data.creatReviewAt = undefined;
  //     },
  //     error: () => this.notifyS.show('刪除失敗', 'error')
  //   });
  // }
}
