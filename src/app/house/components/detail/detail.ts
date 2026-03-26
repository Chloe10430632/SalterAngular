import { AuthService } from './../../../core/services/auth-service';
import { authInterceptor } from './../../../interceptor/auth-interceptor';
import { HouseService } from './../../service/index-service';
import { ReviewService } from './../../service/review-service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateReview } from '../../interface/icreate-review';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {

  isSubmitting: boolean = false;
  userId: number | null = null;
  selectedProperty: any;
  isLoggedIn = true;
  isLoading = false;
  currentSlideIndex = 0;
  newComment = {
    rating: 0,
    comment: '',
    roomTypeId: 0,
  };

  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    public HouseService: HouseService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log('元件初始化了！')
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userId = user.id; // 這裡就是 MemberId！
      } else {
        this.isLoggedIn = false;
        this.userId = null;
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getHouseDetail(id);
    }
  }

  submitComment() {
    console.log('點擊了按鈕！目前的 userId 是:', this.userId);
    if (!this.userId) {
      alert('請先登入');
      return;
    }
    console.log('當前登入的 userId:', this.userId);
    console.log('當前選中的房間資料:', this.selectedProperty);
    this.isSubmitting = true;

    // 依照組員解析出的 id 加上你要送出的資料
    const dto: ICreateReview = {
      roomTypeId: this.selectedProperty?.roomTypeId,
      rating: this.newComment.rating,
      comment: this.newComment.comment,
      memberId: this.userId, // 這裡用動態抓到的 userId
      bookingId: 0 // 後端會自動幫你找 validBookingId，這裡傳 0 即可 (或 DTO 設為可選)
    };
    console.log('準備送出的 DTO 全貌:', dto);
    this.reviewService.addReview(dto).subscribe({
      next: (res) => {
        alert('評論新增成功！');

        // 前端即時顯示 (提升使用者體驗)
        const newReview = {
          rating: this.newComment.rating,
          comment: this.newComment.comment,
          createdTime: new Date()
        };
        this.selectedProperty.reviews = [newReview, ...(this.selectedProperty.reviews || [])];

        this.newComment.comment = ''; // 清空輸入框
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('新增失敗', err);
        // 如果後端回傳 400 (沒資格)，錯誤訊息會在這裡噴出來
        alert(err.error?.message || '新增評論失敗，請確認您是否已完成住宿且尚未評價');
        this.isSubmitting = false;
      }
    });
  }

  getHouseDetail(id: string) {
    this.http.get<any>(`https://localhost:7017/api/Home/${id}`).subscribe({
      next: (data) => {
        //這裡吧API資料存入變數
        this.selectedProperty = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('API Error:', err);
        this.isLoading = false;
      }
    })
  }

  // 計算平均評分
  getAverageRating(): string {
    const reviews = this.selectedProperty?.reviews;
    if (!reviews || reviews.length === 0) return '0.0';
    const total = reviews.reduce((sum: number, rv: any) => sum + rv.rating, 0);
    return (total / reviews.length).toFixed(1);
  }

  // 圖片輪播控制
  scrollIntoView(index: number) {
    this.currentSlideIndex = index;
    const id = 'slide' + index;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  }

  // 這兩個方法用來計算上一張和下一張的索引，讓輪播能無限循環
  getPrevIndex(): number {
    const total = this.selectedProperty?.allImages?.length || 0;
    return (this.currentSlideIndex === 0 ? total - 1 : this.currentSlideIndex - 1);
  }
  getNextIndex(): number {
    const total = this.selectedProperty?.allImages?.length || 0;
    return (this.currentSlideIndex === total - 1) ? 0 : this.currentSlideIndex + 1;
  }

  rating(rating: number) {
    this.newComment.rating = rating;
  }
}
