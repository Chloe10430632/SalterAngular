import { CourseOrderI } from './../../../Interfaces/IIOrder';
import { NotificationService } from './../../../../shared/notifyService/notification-service';
import { Component, Input, OnInit, signal } from '@angular/core';
import { HistoryS } from '../../../Service/history';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { DatePipe, NgClass } from '@angular/common';
import { ReviewsS } from '../../../Service/reviews';
import { FormsModule, NgModel } from '@angular/forms';
import { ReviewI } from '../../../Interfaces/IIreview';

//這是 子 元件//
//學習歷程卡-上過的課//
//抓訂單+評論 //


@Component({
  selector: 'app-attend-course-card',
  imports: [AvatarPipe, DatePipe, NgClass, FormsModule],
  templateUrl: './attend-course-card.html',
  styleUrl: './attend-course-card.css',
})
export class AttendCourseCard implements OnInit {
  data = signal<CourseOrderI[]>([]);
  isLoading = signal(true);
  selectedCourse = signal<CourseOrderI | null>(null);
  currentScore = 3;
  reviewText = '';
  newReview = signal<ReviewI | null>(null);
  //-----------------------//
  constructor(private historyS: HistoryS,
    public notifyS: NotificationService,
    private reviewS: ReviewsS
  ) { }
  //-----------------------//
  ngOnInit(): void {
    this.onLoadingData();
  }

  //-----------------------//
  onLoadingData() {
    this.isLoading.set(true);
    this.historyS.getAttendHistory().subscribe({
      next: (res) => {
        if (res.isSuccess)
          this.data.set(res.data);
        this.isLoading.set(false)
        console.log(res);
      },
      error: () => {
        this.notifyS.show("讀取錯誤", "error");
        this.isLoading.set(false)

      }
    })
  }
  //-----------------------//
  canReview(startDate: string): boolean {
    const today = new Date();
    const courseDate = new Date(startDate);
    return today > courseDate;
  }
  ableEdit(updatedAt: string | null): boolean {
    if (!updatedAt) return false;
    const updateTime = new Date(updatedAt).getTime();
    const now = new Date().getTime();
    return (now - updateTime) < 30000; // 30000 毫秒 = 30 秒
  }
  openReviewModal(item: CourseOrderI) {
    this.selectedCourse.set(item);
    // 如果已經有評論，就帶入舊資料（編輯模式）
    this.currentScore = item.rating ?? 3;
    this.reviewText = item.reviewContent ?? '';

    const modal = document.getElementById('review_modal') as HTMLDialogElement;
    modal.showModal();
  }
  setScore(score: number) {
    this.currentScore = score;
  }
  // 【輔助小工具：更新本地 Signal 盒子】
  // 這就像是直接在籃子裡把那顆壞掉的蘋果換成好的
  updateLocalData(id: number, score: number, content: string) {
    this.data.update(currentList =>
      currentList.map(course =>
        course.courseSessionId === id
          ? { ...course, rating: score, reviewContent: content, updateReviewAt: new Date().toISOString() }
          : course
      )
    );
  }
  closeModal() {
    const modal = document.getElementById('review_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }
  submitReview() {
    const item = this.selectedCourse();
    if (!item) return;

    const payload = {
      courseOrderId: item.courseSessionId,
      rating: this.currentScore,
      reviewContent: this.reviewText
    };

    // 判斷是「新增」還是「編輯」
    if (item.reviewContent) {
      const reviewId = item.courseSessionId ?? 0;
      this.reviewS.editReview(reviewId, payload).subscribe({
        next: (res) => {
          // 修正：這裡一定要寫 res.isSuccess
          if (res.isSuccess) {
            this.notifyS.show("修改成功", "success");
            this.updateLocalData(reviewId, this.currentScore, this.reviewText);
            this.closeModal();
          }
        }
      })
    } else {
      this.reviewS.addReview(payload).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.notifyS.show("評論成功", "success");
            this.onLoadingData(); // 新增完重刷名冊
            this.closeModal();
          }
        }
      });
    }
  }
  onDeleteReview() {
    const item = this.selectedCourse();
    if (!item) return;
    const reviewId = item.courseSessionId ?? 0;

    if (confirm('確定要刪除這則評論嗎？')) {
      this.reviewS.deleteReview(reviewId).subscribe({
        next: (res) => {
          // 修正：一樣要寫 res.isSuccess
          if (res.isSuccess) {
            this.notifyS.show("已刪除評論", "error");
            this.updateLocalData(reviewId, 0, ''); // 清空本地該筆評論
            this.closeModal();
          }
        }
      }
      )
    };
  }

  onComment() { console.log('打開評論視窗'); }
  onEdit() { console.log('編輯評論'); }
  onDelete() { console.log('刪除評論'); }
}
